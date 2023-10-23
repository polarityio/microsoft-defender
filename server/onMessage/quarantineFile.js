const { parseErrorToReadableJson } = require('../dataTransformations');
const { getLogger } = require('../logging');
const { requestWithDefaults } = require('../request');

const quarantineFile = async ({ alert, file }, options, callback) => {
  const Logger = getLogger();
  try {
    await requestWithDefaults({
      method: 'POST',
      site: 'defender',
      route: `machines/${alert.machineId}/StopAndQuarantineFile`,
      body: {
        Comment: file.quarantineComment || 'Quarantine from Polarity',
        Sha1: file.sha1
      },
      options
    });

    callback(null, {
      quarantineSuccessMessage: `File with SHA1: '${file.sha1}' has been Quarantined`
    });
  } catch (error) {
    const err = parseErrorToReadableJson(error);
    Logger.error(
      {
        detail: 'Failed Changing Device Isolation Status Lookup',
        alert,
        file,
        options,
        formattedError: err
      },
      'Changing Device Isolation Status Lookup Failed'
    );

    if ((err.description || '').includes(file.sha1)) {
      return callback(null, {
        quarantineSuccessMessage: `File with SHA1: '${file.sha1}' is already Quarantined`
      });
    }

    if (err.status === 500) {
      return callback(null, {
        quarantineSuccessMessage: `File with SHA1: '${file.sha1}' cannot be quarantined for an unknown reason. View Alert in Defender for more information.`
      });
    }

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

module.exports = quarantineFile;
