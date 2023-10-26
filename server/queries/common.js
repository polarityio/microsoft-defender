const {
  reduce,
  get,
  map,
  groupBy,
  values,
  flatMap,
  concat,
  flow,
  uniqBy,
  compact
} = require('lodash/fp');
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

const createSingleEntityResults = (resultsWithMultipleEntities) =>
  flow(
    flatMap(({ entity: entities, result }) =>
      map((entity) => ({ entity, result }), entities)
    ),
    groupBy('entity.value'),
    values,
    map((resultsGroup) =>
      reduce(
        (agg, { entity, result }) => ({
          entity,
          result: compact(agg.result.concat(result))
        }),
        { result: [] },
        resultsGroup
      )
    )
  )(resultsWithMultipleEntities);

const createUniqRequestsWithMultipleEntities = (requests) =>
  flow(
    groupBy('route'),
    values,
    map((requestsGroup) =>
      reduce(
        (agg, request) => ({
          ...request,
          entity: flow(get('entity'), concat(request.entity), uniqBy('value'))(agg)
        }),
        { entity: [] },
        requestsGroup
      )
    )
  )(requests);

module.exports = {
  MAX_PAGE_SIZE,
  createFiltersFromUserOptions,
  createSingleEntityResults,
  createUniqRequestsWithMultipleEntities
};
