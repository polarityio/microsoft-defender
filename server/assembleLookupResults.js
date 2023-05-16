const {
  flow,
  get,
  size,
  find,
  eq,
  map,
  some,
  filter,
  flatMap,
  concat,
  __,
  toLower,
  reduce,
  includes,
  negate,
  flatten,
  groupBy,
  entries,
  take,
  uniq,
  compact,
  replace,
  join
} = require('lodash/fp');
const { getLogger } = require('./logging');
const { and } = require('./dataTransformations');

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
    kustoQueryResults: getKustoQueryResults(entity, kustoQueryResults, options)
  };
};

const getKustoQueryResults = (entity, kustoQueryResults, options) => {
  const { schema, results: tableRows } =
    getResultForThisEntity(entity, kustoQueryResults) || {};

  const tableFields = flow(
    map(getTableFields(schema, options)),
    groupBy(flow(find(flow(get('name'), eq('SourceTable'))), get('value'))),
    entries,
    map(([tableName, tableRowFields]) => ({
      tableName,
      tableRowCount: size(tableRows),
      tableRowFields: flatten(tableRowFields)
    }))
  )(tableRows);

  return tableFields;
};

const getTableFields = (schema, options) => (tableRow) =>
  flow(
    map(({ name, type }) => ({
      name,
      type: toLower(type),
      value: get(name, tableRow)
    })),
    filter(hasValueAndIsNotIgnored(options)),
    concat(__, { type: 'endOfRow' })
  )(schema);

const isIgnored = flow(
  get('parsedKustoQueryIgnoreFields'),
  concat('$table'),
  filter(negate(eq('SourceTable'))),
  map(toLower)
);

const hasValueAndIsNotIgnored = (options) => (fieldResult) =>
  fieldResult.value && !isIgnored(options).includes(fieldResult.name.toLowerCase());

const createSummaryTags = ({ alerts, incidents, kustoQueryResults }, options) => {
  const threatHuntRowCount = reduce(
    (agg, tableResult) => agg + get('tableRowCount', tableResult),
    0,
    kustoQueryResults
  );

  const userOptionTags = compact(
    map((fieldName) => {
      const fieldValues = flow(
        flatMap(get('tableRowFields')),
        filter(
          flow(
            get('name'),
            toLower,
            replace(/\s/g, ''),
            eq(flow(toLower, replace(/\s/g, ''))(fieldName))
          )
        ),
        map(get('value')),
        uniq,
        take(3),
        join(', '),
        (fieldValues) => (size(fieldValues) === 3 ? fieldValues + '...' : fieldValues)
      )(kustoQueryResults);
      return size(fieldValues) ? `${fieldName}: ${fieldValues}` : '';
    }, options.parsedKustoQuerySummaryFields)
  );

  const alertsSize = size(alerts);
  const incidentsSize = size(incidents);
  const incidentsOrThreatHuntHaveSize = incidentsSize || threatHuntRowCount;
  const countsTag = `${
    alertsSize ? `Alerts: ${alertsSize}${incidentsOrThreatHuntHaveSize ? ' ' : ''}` : ''
  }${
    incidentsSize ? `Incidents: ${incidentsSize}${threatHuntRowCount ? ' ' : ''}` : ''
  }${threatHuntRowCount ? `Threat Hunt: ${threatHuntRowCount}` : ''}`;

  return [].concat(countsTag || []).concat(userOptionTags);
};

module.exports = assembleLookupResults;
