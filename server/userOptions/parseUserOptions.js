const { splitCommaSeparatedUserOption } = require('./utils');

const parseUserOptions = (options) => {
  const parsedIgnoreClassifications = splitCommaSeparatedUserOption(
    'ignoreClassifications',
    options
  );
  const parsedIgnoreDeterminations = splitCommaSeparatedUserOption(
    'ignoreDeterminations',
    options
  );
  const parsedIgnoreSeverities = splitCommaSeparatedUserOption(
    'ignoreSeverities',
    options
  );
  const parsedIgnoreStatuses = splitCommaSeparatedUserOption('ignoreStatuses', options);
  const parsedIgnoreServiceSources = splitCommaSeparatedUserOption(
    'ignoreServiceSources',
    options
  );

  return {
    ...options,
    parsedIgnoreClassifications,
    parsedIgnoreDeterminations,
    parsedIgnoreSeverities,
    parsedIgnoreStatuses,
    parsedIgnoreServiceSources
  };
};

module.exports = parseUserOptions;
