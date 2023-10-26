const { map, flatMap, reduce, filter, pick, find, get, flow } = require('lodash/fp');
const { requestsInParallel } = require('../request');
const {
  createUniqRequestsWithMultipleEntities,
  createSingleEntityResults
} = require('./common');

const getAlerts = async (foundAlerts, kustoQueryResults, options) => {
  const alertRequests = getAlertRequestsWithoutDuplicates(
    foundAlerts,
    kustoQueryResults,
    options
  );
  const alertWithMultipleEntities = await requestsInParallel(alertRequests, 'body');

  const alerts = createSingleEntityResults(alertWithMultipleEntities);

  const alertsWithFoundAlertProperties = combineFoundAlertPropertiesWithAlerts(alerts);

  return alertsWithFoundAlertProperties;
};

const getAlertRequestsWithoutDuplicates = (foundAlerts, kustoQueryResults, options) => {
  const foundAlertRequests = flatMap(
    ({ entity, result: alerts }) =>
      map(
        (alert) => ({
          entity: { ...entity, foundAlerts: alerts },
          method: 'GET',
          site: 'defender',
          route: `alerts/${alert.id}`,
          options
        }),
        alerts
      ),
    foundAlerts
  );

  const kustoAlertRequests = flatMap(
    ({ entity, result: _kustoQueryResults }) =>
      reduce(
        (agg, kustoQueryResult) =>
          kustoQueryResult.AlertId
            ? [
                ...agg,
                {
                  entity,
                  method: 'GET',
                  site: 'defender',
                  route: `alerts/${kustoQueryResult.AlertId}`,
                  options
                }
              ]
            : agg,
        [],
        _kustoQueryResults.results
      ),
    kustoQueryResults
  );

  const uniqueAlertRequests = createUniqRequestsWithMultipleEntities(
    foundAlertRequests.concat(kustoAlertRequests)
  );

  return uniqueAlertRequests;
};

const combineFoundAlertPropertiesWithAlerts = (alertsWithEntities) =>
  map(
    ({ entity: { foundAlerts, ..._entity }, result: alerts }) => ({
      entity: _entity,
      result: map((alert) => {
        const matchingFoundAlert = foundAlerts
          ? find((foundAlert) => foundAlert.id === alert.id, foundAlerts)
          : null;

        const evidence = matchingFoundAlert
          ? matchAlertEvidenceFromSearchResults(alert, matchingFoundAlert)
          : alert.evidence;

        const foundFiles = flow(
          filter((evidence) => evidence.entityType === 'File'),
          map((foundFile) => ({ ...foundFile, quarantineComment: '' }))
        )(evidence);

        return {
          ...alert,
          foundFiles,
          ...(matchingFoundAlert && {
            ...pick(
              ['actorDisplayName', 'threatDisplayName', 'recommendedActions'],
              matchingFoundAlert
            ),
            evidence
          })
        };
      }, alerts)
    }),
    alertsWithEntities
  );

const matchAlertEvidenceFromSearchResults = (alert, matchingFoundAlert) =>
  map((evidence) => {
    const matchingFoundAlertEvidence = find(
      (foundAlertEvidence) =>
        evidence.sha1 === get('fileDetails.sha1', foundAlertEvidence),
      matchingFoundAlert.evidence
    );

    return {
      ...evidence,
      ...(matchingFoundAlertEvidence && {
        ...pick(
          [
            'remediationStatusDetails',
            'verdict',
            'tags',
            'roles',
            'imageFile',
            'parentProcessImageFile'
          ],
          matchingFoundAlertEvidence
        ),
        ...pick(
          ['filePublisher', 'signer', 'issuer', 'fileSize'],
          matchingFoundAlertEvidence.fileDetails
        )
      })
    };
  }, alert.evidence);

module.exports = getAlerts;
