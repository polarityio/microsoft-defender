const { parseErrorToReadableJson } = require('../dataTransformations');
const { getLogger } = require('../logging');
const { requestWithDefaults } = require('../request');

const changeIsolationStatus = async ({ newStatus, device }, options, callback) => {
  const Logger = getLogger();
  try {
    const deviceWithNewStatus = await doIsolationStatusChangeByNewStatus[newStatus](
      device,
      options
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

const doIsolationStatusChangeByNewStatus = {
  cancel: async (device, options) => {
    await requestWithDefaults({
      method: 'POST',
      site: 'defender',
      route: `machines/${device.id}/cancel`,
      body: { Comment: device.statusChangeComment },
      options
    });
    const [devicesWithPendingStatus] = await checkIfDevicesIsolationIsPending(
      { devices: [device] },
      options,
      () => {}
    );
    return devicesWithPendingStatus;
  },
  releaseFromIsolation: async (device, options) => {
    await requestWithDefaults({
      method: 'POST',
      site: 'defender',
      route: `machines/${device.id}/unisolate`,
      body: { Comment: device.statusChangeComment },
      options
    });
    const [devicesWithPendingStatus] = await checkIfDevicesIsolationIsPending(
      { devices: [device] },
      options,
      () => {}
    );
    return devicesWithPendingStatus;
  },
  isolate: async (device, options) => {
    await requestWithDefaults({
      method: 'POST',
      site: 'defender',
      route: `machines/${device.id}/isolate`,
      body: {
        Comment: device.statusChangeComment,
        IsolationType: 'Full'
      },
      options
    });
    const [devicesWithPendingStatus] = await checkIfDevicesIsolationIsPending(
      { devices: [device] },
      options,
      () => {}
    );
    return devicesWithPendingStatus;
  }
};

module.exports = changeIsolationStatus;
