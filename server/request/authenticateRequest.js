const { ConfidentialClientApplication } = require('@azure/msal-node');
const { get, flow, pick, join, values, concat } = require('lodash/fp');
const MsalNodeHttpAuthClient = require('../msal-node-http-client');
const msal = require('@azure/msal-node');
const configJs = require('../../config/config');
const configJson = require('../../config/config.json');
const { getLogger } = require('../logging');

const NodeCache = require('node-cache');
const clientCache = new NodeCache();
const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});

let scopesBySite;

// If the version of node currently running is 12 then we are on the v4 server and we
// want to use the `config.js`.  Otherwise, we are on v5 and we use the `config.json`.
const config = process.versions.node.startsWith('12.') ? configJs : configJson;

const authenticateRequest = async (
  { site, route, options, ...requestOptions },
  requestWithDefaults
) => {
  const requestUrlsBySite = {
    graph: `${options.graphApiUrl}/v1.0/security/`,
    defender: `${options.microsoft365ApiUrl}/api/`
  };

  scopesBySite = {
    graph: `${options.graphApiUrl}/.default`,
    defender: `${options.microsoft365ApiUrl}/.default`
  };

  const accessToken = await getToken(options, site, requestWithDefaults);

  return {
    ...requestOptions,
    url: requestUrlsBySite[site] + route,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${accessToken}`
    }
  };
};

const getToken = async (options, site, requestWithDefaults) => {
  const clientCacheId = flow(
    pick(['clientId', 'tenantId', 'clientSecret']),
    values,
    concat(site),
    join('')
  )(options);

  const client = await getClient(clientCacheId, options, requestWithDefaults);

  const accessToken = await getAccessToken(clientCacheId, client, site);

  return accessToken;
};

const getClient = async (clientCacheId, options, requestWithDefaults) => {
  let client = clientCache.get(clientCacheId);
  let Logger = getLogger();

  if (!client) {
    // The msal-node library uses its own HTTPClient which does not have proper proxy support.
    // As a result, we have to implement our own HTTPClient that wraps the postman-request library
    // to get proper proxy support.
    const customHttpClient = new MsalNodeHttpAuthClient(requestWithDefaults, Logger);

    const clientConfig = {
      auth: {
        clientId: options.clientId,
        authority: 'https://login.microsoftonline.com/' + options.tenantId,
        clientSecret: options.clientSecret
      },
      system: {
        loggerOptions: {
          loggerCallback(logLevel, message, containsPii) {
            // MSAL logs some items even at the info level which we don't want so we just return
            // if the integration's log level is at `info`.
            if(config.logging.level === 'info') return;
            
            Logger[msalLogLevelToPolarity(logLevel)](
              { logLevel, message, containsPii },
              'MSAL Logger'
            );
          },
          piiLoggingEnabled: config.logging.level === 'trace' ? true : false,
          logLevel: polarityToMsalLogLevel(config.logging.level)
        },
        networkClient: customHttpClient.getClient()
      }
    };
    client = new ConfidentialClientApplication(clientConfig);
    clientCache.set(clientCacheId, client);
  }
  return client;
};

function polarityToMsalLogLevel(polarityLogLevel) {
  switch (polarityLogLevel) {
    case 'trace':
      return msal.LogLevel.Verbose;
    case 'debug':
      return msal.LogLevel.Verbose;
    case 'info':
      return msal.LogLevel.Info;
    case 'warn':
      return msal.LogLevel.Warning;
    case 'error':
      return msal.LogLevel.Error;
    default:
      return msal.LogLevel.Info;
  }
}

function msalLogLevelToPolarity(msalLogLevel) {
  switch (msalLogLevel) {
    case msal.LogLevel.Verbose:
      return 'trace';
    case msal.LogLevel.Info:
      return 'info';
    case msal.LogLevel.Warning:
      return 'warn';
    case msal.LogLevel.Error:
      return 'error';
    default:
      return 'info';
  }
}

const getAccessToken = async (clientCacheId, client, site) => {
  let accessToken = tokenCache.get(clientCacheId);
  if (!accessToken) {
    accessToken = get(
      'accessToken',
      await client.acquireTokenByClientCredential({
        scopes: [scopesBySite[site]]
      })
    );

    tokenCache.set(clientCacheId, accessToken);
  }
  return accessToken;
};

module.exports = authenticateRequest;
