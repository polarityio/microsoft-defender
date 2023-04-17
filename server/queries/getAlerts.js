const { flow, filter, get, map } = require('lodash/fp');
const { MAX_PAGE_SIZE } = require('../constants');
const { requestsInParallel } = require('../request');
const { createFiltersFromUserOptions } = require('./common');

const getAlerts = async (entities, options) =>
  flow(
    filter(get('isEmail')),
    createFiltersFromUserOptions(options),
    map(({ emailEntity, userOptionBasedFilters }) => ({
      entity: emailEntity,
      method: 'GET',
      route: 'alerts_v2',
      qs: {
        $filter: `assignedTo eq '${emailEntity.value}'${userOptionBasedFilters}`,
        $top: MAX_PAGE_SIZE
      },
      options
    })),
    async (alertRequests) => await requestsInParallel(alertRequests, 'body.value')
  )(entities);

module.exports = getAlerts;
