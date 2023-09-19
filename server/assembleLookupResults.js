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
  join,
  keys,
  first,
  isArray,
  orderBy,
  fromPairs
} = require('lodash/fp');
const mapObj = require('lodash/fp/map').convert({ cap: false });

const { getLogger } = require('./logging');
const { and } = require('./dataTransformations');

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
    incidents: getResultForThisEntity(entity, incidents),
    alerts: getResultForThisEntity(entity, alerts),
    devices: getResultForThisEntity(entity, devices),
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

/* 
192.168.1.66
34.198.146.206
ops@polarityio.onmicrosoft.com
MD5
0130864049ea1deded8df354dafca2ae
SHA1
0b1c35e1519d8e92aa68d06ca05599ad661053b9
ff2ed360db039cff04cdf55bcc27518469b6a113
e3ce7157dc3334a1d95f2aad137d9ca66160b71c
95fa4fde04e4a1529a2ae5b031af3163f2b1109e
5b766fd27cf47495caf6ffe41779a49077f4604
SHA256
b3103dac32cbe6ff2d44ab4e99ee0579cf30f0a8a8f1bf32ab51ec5d7a708a7a
4c8915e07be1904a3bc02e4f8db0a80bb932ce610d97eabb9151b4e51f449980
b82ab0fe6487c7fde8ad87c12067593044855e689fa3a423355f4f79651e2560
0170ce37427281d2a62373714abe897ee27de329414469bd1283084b8c3beee0
*/

/*
TODOs
- figure out which fields I need to enable device or file isolation
  Kusto Query Results
    - Get Alert: https://api.securitycenter.microsoft.com/api/alerts/{{AlertId}}
  Alerts
    - Get Alert: https://api.securitycenter.microsoft.com/api/alerts/{{ALERT.id}}
      - Add addition GET Alert to all alerts found with alert search
    - Get Machine for Get Alert Request: https://api.securitycenter.microsoft.com/api/machines/{{ALERT.machineId}}
  Isolation
    - Machine Isolation: https://api.securitycenter.microsoft.com/api/machines/{{MACHINE.machineId}}/isolate
    - File Isolation: https://api.securitycenter.microsoft.com/api/machines/{{ALERT.machineId}}/StopAndQuarantineFile',
      body: { ..., Sha1: ALERT.evidence.INDEX.sha1 }
      
- First get the alerts, then use the alerts to get the machines
  - Look out for alert duplication across kusto and alert queries

- Add Machines to UI & Update Alert display field paths
  - Add alert fields to from search to get alert results
  - change fields in UI for alerts

  - Add Found Files to Alerts display to display isolation button around
  - Display Machines as `Devices`
- Implement Isolation buttons and onMessage requests
  - Isolate file button `Quarantine File` & Isolation Machine button `Isolate Device`
  - Make isolation buttons not display according to user options

*/
