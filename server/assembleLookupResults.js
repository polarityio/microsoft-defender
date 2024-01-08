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
  negate,
  flatten,
  groupBy,
  entries,
  take,
  uniq,
  compact,
  replace,
  join,
  orderBy,
  fromPairs
} = require('lodash/fp');
const mapObj = require('lodash/fp/map').convert({ cap: false });


const assembleLookupResults = (
  entities,
  alerts,
  incidents,
  devices,
  kustoQueryResults,
  options
) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      alerts,
      incidents,
      devices,
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
  devices,
  kustoQueryResults,
  options
) => {
  return {
    incidents: getResultForThisEntity(entity, incidents) || [],
    alerts: getResultForThisEntity(entity, alerts) || [],
    devices: getResultForThisEntity(entity, devices) || [],
    kustoQueryResults: getKustoQueryResults(entity, kustoQueryResults, options) || []
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
    map(({ name, type }) =>
      name === 'AdditionalFields'
        ? flow(
            get(name),
            (field) => (field ? flow(JSON.parse)(field) : {}),
            mapObj((value, key) =>
              IGNORE_FIELDS.includes(key) ? null : [key, JSON.stringify(value)]
            ),
            compact,
            fromPairs,
            (additionalFields) => ({
              name,
              type: 'object',
              value: additionalFields
            })
          )(tableRow)
        : {
            name,
            type: toLower(type),
            value: get(name, tableRow)
          }
    ),
    flatten,
    orderBy(
      (field) => ({ string: 1, datetime: 2, int64: 3, array: 4, object: 5 }[field.type]),
      ['asc']
    ),
    filter(hasValueAndIsNotIgnored(options)),
    concat(__, { type: 'endOfRow' })
  )(schema);

const IGNORE_FIELDS = ['$id'];

const isIgnored = flow(
  get('parsedKustoQueryIgnoreFields'),
  concat('$table'),
  filter(negate(eq('SourceTable'))),
  map(toLower)
);

const hasValueAndIsNotIgnored = (options) => (fieldResult) =>
  fieldResult.value && !isIgnored(options).includes(fieldResult.name.toLowerCase());

const createSummaryTags = (
  { alerts, incidents, devices, kustoQueryResults },
  options
) => {
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
  const devicesSize = size(devices);
  const countsTag =
    (alertsSize
      ? `Alerts: ${alertsSize}${
          incidentsSize || devicesSize || threatHuntRowCount ? ' ' : ''
        }`
      : '') +
    (incidentsSize
      ? `Incidents: ${incidentsSize}${devicesSize || threatHuntRowCount ? ' ' : ''}`
      : '') +
    (devicesSize ? `Devices: ${devicesSize}${threatHuntRowCount ? ' ' : ''}` : '') +
    (threatHuntRowCount ? `Threat Hunt: ${threatHuntRowCount}` : '');

  return [].concat(countsTag || []).concat(userOptionTags);
};

module.exports = assembleLookupResults;
