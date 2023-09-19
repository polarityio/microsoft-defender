const { map, flatMap } = require('lodash/fp');
const { requestsInParallel } = require('../request');
const { createSingleEntityResults, createUniqRequestsWithMultipleEntities } = require('./common');
const { getLogger } = require('../logging');

const getDevices = async (alerts, options) => {
  const machineRequests = getMachineRequestsWithoutDuplicates(alerts, options);

  const machinesWithMultipleEntities = await requestsInParallel(machineRequests, 'body');

  const machines = createSingleEntityResults(machinesWithMultipleEntities);

  return machines;
};

const getMachineRequestsWithoutDuplicates = (alerts, options) => {
  const machinesFromAlertsRequests = flatMap(
    ({ entity, result: _alerts }) =>
      map(
        (alert) => ({
          entity,
          method: 'GET',
          site: 'defender',
          route: `machines/${alert.machineId}`,
          options
        }),
        _alerts
      ),
    alerts
  );

  const uniqueMachineRequests = createUniqRequestsWithMultipleEntities(
    machinesFromAlertsRequests
  );

  return uniqueMachineRequests;
};

module.exports = getDevices;
