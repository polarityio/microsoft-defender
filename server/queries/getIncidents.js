const { flow, filter, get, map } = require('lodash/fp');
const { MAX_PAGE_SIZE } = require('../constants');
const { requestsInParallel } = require('../request');
const { createFiltersFromUserOptions } = require('./common');

const getIncidents = async (entities, options) =>
  flow(
    filter(get('isEmail')),
    createFiltersFromUserOptions(options),
    map(({ emailEntity, userOptionBasedFilters }) => ({
      entity: emailEntity,
      method: 'GET',
      route: 'incidents',
      qs: {
        $filter: `assignedTo eq '${emailEntity.value}'${userOptionBasedFilters}`,
        $top: MAX_PAGE_SIZE
      },
      options
    })),
    async (incidentRequests) => await requestsInParallel(incidentRequests, 'body.value')
  )(entities);

module.exports = getIncidents;
