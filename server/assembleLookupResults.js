const { flow, get, size, find, eq, map, some, keys } = require('lodash/fp');

const assembleLookupResults = (entities, alerts, incidents, kustoQueryResults, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      alerts,
      incidents,
      kustoQueryResults,
      options
    );

    const resultsFound = some(size, resultsForThisEntity);

    const lookupResult = {
      entity,
      data: resultsFound
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultForThisEntity = (entity, results) =>
  flow(find(flow(get('entity.value'), eq(entity.value))), get('result'))(results);

const getResultsForThisEntity = (
  entity,
  alerts,
  incidents,
  kustoQueryResults,
  options
) => {
  return {
    alerts: getResultForThisEntity(entity, alerts),
    incidents: getResultForThisEntity(entity, incidents),
    kustoQueryResults: getResultForThisEntity(entity, kustoQueryResults)
  };
};

const createSummaryTags = ({}, options) => [].concat([]); // TODO

module.exports = assembleLookupResults;
