const { ConfidentialClientApplication } = require('@azure/msal-node');
const { get, flow, pick, join, concat, values } = require('lodash/fp');
const { mapObject } = require('../dataTransformations');

const NodeCache = require('node-cache');
const clientCache = new NodeCache();
const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});

const microsoftGraphApiUrl = 'https://graph.microsoft.com/';
const microsoftSecurityApiUrl = `${microsoftGraphApiUrl}v1.0/security/`;

const authenticateRequest = async ({ route, options, ...requestOptions }) => {
  const accessToken = await getToken(options);

  return {
    ...requestOptions,
    url: microsoftSecurityApiUrl + route,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${accessToken}`
    }
  };
};

const getToken = async (options) => {
  const clientCacheId = flow(
    pick(['clientId', 'tenantId', 'clientSecret']),
    values,
    join('')
  )(options);

  const client = await getClient(clientCacheId, options);

  const accessToken = await getAccessToken(clientCacheId, client);

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

const getAccessToken = async (clientCacheId, client) => {
  let accessToken = tokenCache.get(clientCacheId);
  if (!accessToken) {
    accessToken = get(
      'accessToken',
      await client.acquireTokenByClientCredential({ scopes: [`${microsoftGraphApiUrl}.default`] })
    );

    tokenCache.set(clientCacheId, accessToken);
  }
  return accessToken;
};

module.exports = authenticateRequest;
