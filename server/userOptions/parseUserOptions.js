const { map, replace } = require('lodash/fp');
const { splitCommaSeparatedUserOption } = require('./utils');

const parseUserOptions = (options) => ({
  ...options,
  parsedIgnoreClassifications: splitCommaSeparatedUserOption(
    'ignoreClassifications',
    options
  ),
  parsedIgnoreDeterminations: splitCommaSeparatedUserOption(
    'ignoreDeterminations',
    options
  ),
  parsedIgnoreSeverities: splitCommaSeparatedUserOption('ignoreSeverities', options),
  parsedIgnoreStatuses: splitCommaSeparatedUserOption('ignoreStatuses', options),
  parsedIgnoreServiceSources: splitCommaSeparatedUserOption(
    'ignoreServiceSources',
    options
  ),
  parsedKustoQuerySummaryFields: map(
    replace(/\s/g, ''),
    splitCommaSeparatedUserOption('kustoQuerySummaryFields', options)
  ),
  parsedKustoQueryIgnoreFields: map(
    replace(/\s/g, ''),
    splitCommaSeparatedUserOption('kustoQueryIgnoreFields', options)
  )
});

module.exports = parseUserOptions;
