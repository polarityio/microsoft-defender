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
    async (incidentRequests) =>
      map(
        (request) => ({
          entity: request.entity,
          result: [
            {
              '@odata.type': '#microsoft.graph.security.incident',
              id: '2972395',
              incidentWebUrl:
                'https://security.microsoft.com/incidents/2972395?tid=12f988bf-16f1-11af-11ab-1d7cd011db47',
              redirectIncidentId: null,
              tenantId: 'b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              displayName:
                'Multi-stage incident involving Initial access & Command and control on multiple endpoints reported by multiple sources',
              createdDateTime: '2021-08-13T08:43:35.5533333Z',
              lastUpdateDateTime: '2021-09-30T09:35:45.1133333Z',
              assignedTo: 'jonp@polarity.io',
              classification: 'TruePositive',
              determination: 'MultiStagedAttack',
              status: 'Active',
              severity: 'Medium',
              customTags: ['Demo'],
              comments: [
                {
                  comment: 'Demo incident',
                  createdBy: 'DavidS@contoso.onmicrosoft.com',
                  createdTime: '2021-09-30T12:07:37.2756993Z'
                },
                {
                  comment: 'Demo incident',
                  createdBy: 'DavidS@contoso.onmicrosoft.com',
                  createdTime: '2021-09-30T12:07:37.2756993Z'
                },
                {
                  comment: 'Demo incident',
                  createdBy: 'DavidS@contoso.onmicrosoft.com',
                  createdTime: '2021-09-30T12:07:37.2756993Z'
                },
              ]
            },
            {
              '@odata.type': '#microsoft.graph.security.incident',
              id: '2972395',
              incidentWebUrl:
                'https://security.microsoft.com/incidents/2972395?tid=12f988bf-16f1-11af-11ab-1d7cd011db47',
              redirectIncidentId: null,
              tenantId: 'b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              displayName:
                'Multi-stage incident involving Initial access & Command and control on multiple endpoints reported by multiple sources',
              createdDateTime: '2021-08-13T08:43:35.5533333Z',
              lastUpdateDateTime: '2021-09-30T09:35:45.1133333Z',
              assignedTo: 'jonp@polarity.io',
              classification: 'TruePositive',
              determination: 'MultiStagedAttack',
              status: 'Active',
              severity: 'Medium',
              customTags: ['Demo'],
              comments: [
                {
                  comment: 'Demo incident',
                  createdBy: 'DavidS@contoso.onmicrosoft.com',
                  createdTime: '2021-09-30T12:07:37.2756993Z'
                }
              ]
            }
          ]
        }),
        incidentRequests
      ) //await requestsInParallel(incidentRequests, 'body.value')
  )(entities);

module.exports = getIncidents;
