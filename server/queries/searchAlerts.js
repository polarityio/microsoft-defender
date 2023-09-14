const { flow, filter, get, map } = require('lodash/fp');
const { MAX_PAGE_SIZE } = require('../constants');
const { requestsInParallel } = require('../request');
const { createFiltersFromUserOptions } = require('./common');

const searchAlerts = async (entities, options) =>
  flow(
    filter(get('isEmail')),
    createFiltersFromUserOptions(options),
    map(({ emailEntity, userOptionBasedFilters }) => ({
      entity: emailEntity,
      method: 'GET',
      site: 'graph',
      route: 'alerts_v2',
      qs: {
        $filter: `assignedTo eq '${emailEntity.value}'${userOptionBasedFilters}`,
        $top: MAX_PAGE_SIZE
      },
      options
    })),
    async (alertRequests) => await requestsInParallel(alertRequests, 'body.value')
  )(entities);

module.exports = searchAlerts;
