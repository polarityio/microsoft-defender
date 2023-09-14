const {
  searchAlerts,
  searchIncidents,
  searchKustoAdvancedThreatHuntingResults,
  getAlerts,
  getDevices
} = require('./queries');

const searchEntities = async (entities, options) => {
  const [foundAlerts, incidents, kustoQueryResults] = await Promise.all([
    searchAlerts(entities, options),
    searchIncidents(entities, options),
    searchKustoAdvancedThreatHuntingResults(entities, options)
  ]);

  const alerts = await getAlerts(foundAlerts, kustoQueryResults, options);
  const devices = await getDevices(alerts, options);

  return { alerts, devices, incidents, kustoQueryResults };
};

module.exports = searchEntities;
