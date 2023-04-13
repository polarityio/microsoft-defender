const { flow, filter, get, map, replace } = require('lodash/fp');
const { MAX_PAGE_SIZE } = require('../constants');
const { requestsInParallel } = require('../request');
const { createFiltersFromUserOptions } = require('./common');

const getKustoAdvancedThreatHuntingResults = async (entities, options) =>
  options.kustoQueryString
    ? flow(
        map((entity) => ({
          entity,
          method: 'POST',
          route: 'runHuntingQuery',
          body: {
            Query: replace(
              /{{ENTITY}}/gi,
              escapeQuotes(entity.value),
              options.kustoQueryString
            )
          }
        })),
        async (advancedThreatHuntingKustoQueryRequests) =>
          await requestsInParallel(advancedThreatHuntingKustoQueryRequests, 'body')
      )(entities)
    : [];

const escapeQuotes = replace(/(\r\n|\n|\r)/gm, '');

module.exports = getKustoAdvancedThreatHuntingResults;
