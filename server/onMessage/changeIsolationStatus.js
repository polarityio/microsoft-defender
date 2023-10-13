const { get } = require('lodash/fp');
const { parseErrorToReadableJson, sleep } = require('../dataTransformations');
const { getLogger } = require('../logging');
const { requestWithDefaults } = require('../request');



const changeIsolationStatus = async ({ newStatus, device }, options, callback) => {
  const Logger = getLogger();
  try {
    const newStatusRoute = newStatusRouteByNewStatus[newStatus](device);

    const changedStatusResponse = get(
      'body',
      await requestWithDefaults({
        method: 'POST',
        site: 'defender',
        route: newStatusRoute,
        body: {
          Comment: device.statusChangeComment || 'Change from Polarity',
          ...(newStatusRoute === 'isolate' && { IsolationType: 'Full' })
        },
        options
      })
    );

    const deviceWithNewStatus = changeDeviceStatusByNewStatus[newStatus](
      device,
      changedStatusResponse
    );

    callback(null, { deviceWithNewStatus });
  } catch (error) {
    const err = parseErrorToReadableJson(error);
    Logger.error(
      {
        detail: 'Failed Changing Device Isolation Status Lookup',
        newStatus,
        device,
        options,
        formattedError: err
      },
      'Changing Device Isolation Status Lookup Failed'
    );
    return callback({
      errors: [
        {
          err: error,
          detail: error.message || 'Changing Device Isolation Status Lookup Failed'
        }
      ]
    });
  }
};

const newStatusRouteByNewStatus = {
  cancel: (device) => `machineactions/${device.pendingActionId}/cancel`,
  releaseFromIsolation: (device) => `machines/${device.id}/unisolate`,
  isolate: (device) => `machines/${device.id}/isolate`
};

const changeDeviceStatusByNewStatus = {
  cancel: (device, changedStatusResponse) => ({
    ...device,
    pendingActionId: undefined,
    deviceIsPending: false,
    isPendingIsolation: false,
    deviceIsIsolated: changedStatusResponse.type === 'Unisolate'
  }),
  releaseFromIsolation: (device, changedStatusResponse) => ({
    ...device,
    pendingActionId: changedStatusResponse.id,
    deviceIsPending: true,
    isPendingIsolation: false,
    deviceIsIsolated: true
  }),
  isolate: (device, changedStatusResponse) => ({
    ...device,
    pendingActionId: changedStatusResponse.id,
    deviceIsPending: true,
    isPendingIsolation: true,
    deviceIsIsolated: false
  })
};

module.exports = changeIsolationStatus;
