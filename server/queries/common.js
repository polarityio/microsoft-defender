const { reduce, get, map } = require('lodash/fp');
const { DateTime } = require('luxon');
const MAX_PAGE_SIZE = 30;

const createFiltersFromUserOptions = (options) => {
  const ignoreClassificationsFilters = createIgnoreFiltersFromUserOption(
    'parsedIgnoreClassifications',
    'classification',
    options
  );
  const ignoreDeterminationsFilters = createIgnoreFiltersFromUserOption(
    'parsedIgnoreDeterminations',
    'determination',
    options
  );
  const ignoreSeveritiesFilters = createIgnoreFiltersFromUserOption(
    'parsedIgnoreSeverities',
    'severity',
    options
  );
  const ignoreStatusesFilters = createIgnoreFiltersFromUserOption(
    'parsedIgnoreStatuses',
    'status',
    options
  );
  const ignoreServiceSourcesFilters = createIgnoreFiltersFromUserOption(
    'parsedIgnoreServiceSources',
    'serviceSource',
    options
  );

  const createdLookbackDaysFilters = getLookbackDaysFilter(
    'createdLookbackDays',
    'createdDateTime',
    options
  );

  const userOptionBasedFilters =
    ignoreClassificationsFilters +
    ignoreDeterminationsFilters +
    ignoreSeveritiesFilters +
    ignoreStatusesFilters +
    ignoreServiceSourcesFilters +
    createdLookbackDaysFilters;

  return (emailEntities) =>
    map((emailEntity) => ({ emailEntity, userOptionBasedFilters }), emailEntities);
};

const createIgnoreFiltersFromUserOption = (optionKey, fieldField, options) =>
  reduce(
    (agg, ignoreItem) => agg + ` and ${fieldField} ne '${ignoreItem}'`,
    '',
    get(optionKey, options)
  );

const getLookbackDaysFilter = (lookbackDaysOptionKey, fieldField, options) =>
  ` and ${fieldField} gt ${DateTime.local()
    .minus({ days: get(lookbackDaysOptionKey, options) })
    .toFormat('yyyy-LL-dd')}`;

module.exports = { MAX_PAGE_SIZE, createFiltersFromUserOptions };
