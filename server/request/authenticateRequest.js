const { ConfidentialClientApplication } = require('@azure/msal-node');
const { get, flow, pick, join, values, concat } = require('lodash/fp');

const NodeCache = require('node-cache');
const clientCache = new NodeCache();
const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});


let scopesBySite;

const authenticateRequest = async ({ site, route, options, ...requestOptions }) => {
  const requestUrlsBySite = {
    graph: `${options.graphApiUrl}v1.0/security/`,
    defender: `${options.microsoft365ApiUrl}api/`
  };

  scopesBySite = {
    graph: `${options.graphApiUrl}.default`,
    defender: `${options.microsoft365ApiUrl}.default`
  };

  const accessToken = await getToken(options, site);

  return {
    ...requestOptions,
    url: requestUrlsBySite[site] + route,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${accessToken}`
    }
  };
};

const getToken = async (options, site) => {
  const clientCacheId = flow(
    pick(['clientId', 'tenantId', 'clientSecret']),
    values,
    concat(site),
    join('')
  )(options);

  const client = await getClient(clientCacheId, options);

  const accessToken = await getAccessToken(clientCacheId, client, site);

  return accessToken;
};

const getClient = async (clientCacheId, options) => {
  let client = clientCache.get(clientCacheId);
  if (!client) {
    const config = {
      auth: {
        clientId: options.clientId,
        authority: 'https://login.microsoftonline.com/' + options.tenantId,
        clientSecret: options.clientSecret
      }
    };
    client = new ConfidentialClientApplication(config);
    clientCache.set(clientCacheId, client);
  }
  return client;
};

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
