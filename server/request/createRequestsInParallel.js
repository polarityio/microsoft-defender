const { parallelLimit } = require('async');
const { map, get, getOr, filter, flow, negate, isEmpty } = require('lodash/fp');

const createRequestsInParallel =
  (requestWithDefaults) =>
  async (
    requestsOptions,
    responseGetPath,
    limit = 10,
    onlyReturnPopulatedResults = true
  ) => {
    const unexecutedRequestFunctions = map(
      ({ entity, ...requestOptions }) =>
        async () => {
          const response = await requestWithDefaults(requestOptions);
          const result = responseGetPath ? get(responseGetPath, response) : response;
          return entity ? { entity, result } : result;
        },
      requestsOptions
    );

    const results = await parallelLimit(unexecutedRequestFunctions, limit);

    return onlyReturnPopulatedResults
      ? filter(
          flow((result) => getOr(result, 'result', result), negate(isEmpty)),
          results
        )
      : results;
  };

module.exports = createRequestsInParallel;
