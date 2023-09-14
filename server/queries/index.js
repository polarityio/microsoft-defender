const searchAlerts = require('./searchAlerts');
const searchIncidents = require('./searchIncidents');
const searchKustoAdvancedThreatHuntingResults = require('./searchKustoAdvancedThreatHuntingResults');
const getAlerts = require('./getAlerts');
const getDevices = require('./getDevices');

module.exports = {
  searchAlerts,
  searchIncidents,
  searchKustoAdvancedThreatHuntingResults,
  getAlerts,
  getDevices,
};
