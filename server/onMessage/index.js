const checkIfDevicesIsolationIsPending = require('./checkIfDevicesIsolationIsPending');
const changeIsolationStatus = require('./changeIsolationStatus');
const quarantineFile = require('./quarantineFile');

module.exports = {
  checkIfDevicesIsolationIsPending,
  changeIsolationStatus,
  quarantineFile
};
