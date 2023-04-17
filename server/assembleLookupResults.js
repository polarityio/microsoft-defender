const {
  flow,
  get,
  size,
  find,
  eq,
  map,
  some,
  keys,
  filter,
  assign,
  flatMap,
  concat,
  __,
  toLower
} = require('lodash/fp');

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
    kustoQueryResults: getKustoQueryResults(entity, kustoQueryResults)
  };
};

const getKustoQueryResults = (entity, kustoQueryResults) => {
  const queryResultsForThisEntity = getResultForThisEntity(entity, kustoQueryResults);
  const resultsWithContent = filter(
    flow(get('results'), size),
    queryResultsForThisEntity
  );

  const resultsWithTableFields = map(
    (queryResult) => ({ ...queryResult, tableFields: getTableFields(queryResult) }),
    resultsWithContent
  );
  return resultsWithTableFields;
};

const getTableFields = (queryResult) => {
  const tableRows = get('results', queryResult);
  const addFieldNameAndType =
    (tableRow) =>
    ({ Name: name, Type }) => ({
      name,
      type: toLower(Type),
      value: get(name, tableRow)
    });

  const formattedTableFields = flatMap(
    (tableRow) =>
      flow(
        get('schema'),
        map(addFieldNameAndType(tableRow)),
        concat(__, { type: 'endOfRow' })
      )(queryResult),
    tableRows
  );
  return formattedTableFields;
};

const createSummaryTags = ({ alerts, incidents, kustoQueryResults }, options) => {
  const threatHuntRowCount = reduce(
    (agg, tableResult) => agg + flow(get('results'), size)(tableResult),
    0,
    kustoQueryResults
  );
  return []
    .concat(size(alerts) ? `Alerts: ${size(alerts)}` : [])
    .concat(size(incidents) ? `Incidents: ${size(incidents)}` : [])
    .concat(threatHuntRowCount ? `Threat Hunt: ${threatHuntRowCount}` : []);
};

module.exports = assembleLookupResults;
