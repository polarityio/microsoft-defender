const { reduce, flow, eq, get } = require('lodash/fp');
const { parseErrorToReadableJson } = require('../dataTransformations');
const { getLogger } = require('../logging');
const { requestWithDefaults } = require('../request');

const checkIfDevicesIsolationIsPending = async ({ devices }, options, callback) => {
  const Logger = getLogger();
  try {
    const machineActions = get(
      'value',
      await requestWithDefaults({
        method: 'GET',
        site: 'defender',
        route: 'machineactions',
        options
      })
    );

    const devicesWithPendingStatus = map((device) => {
      const deviceActionsForThisDevice = filter(
        (action) => action.machineId === device.machineId && action.type === 'Isolate',
        machineActions
      );
      const mostRecentAction = reduce(
        (agg, action) =>
          DateTime.fromISO(agg.creationDateTimeUtc) >
          DateTime.fromISO(action.creationDateTimeUtc)
            ? agg
            : action,
        { creationDateTimeUtc: '1980-01-01' },
        deviceActionsForThisDevice
      );
      const deviceIsPending = flow(get('status'), eq('Pending'))(mostRecentAction);

      return {
        ...device,
        ...(deviceIsPending && { pendingActionId: mostRecentAction.id }),
        deviceIsPending
      };
    }, devices);

    callback(null, { devicesWithPendingStatus });
    return devicesWithPendingStatus;;
  } catch (error) {
    const err = parseErrorToReadableJson(error);
    Logger.error(
      {
        detail: 'Failed Getting Device Status Lookup',
        options,
        formattedError: err
      },
      'Getting Device Status Lookup Failed'
    );
    callback(null, { devicesWithPendingStatus: devices });
    return devices;
  }
};

module.exports = checkIfDevicesIsolationIsPending;
