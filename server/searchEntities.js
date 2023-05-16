const {
  getAlerts,
  getIncidents,
  getKustoAdvancedThreatHuntingResults
} = require('./queries');

const searchEntities = async (entities, options) => {
  const [alerts, incidents, kustoQueryResults] = await Promise.all([
    getAlerts(entities, options),
    getIncidents(entities, options),
    getKustoAdvancedThreatHuntingResults(entities, options)
  ]);

  return { alerts, incidents, kustoQueryResults };
};

module.exports = searchEntities;
