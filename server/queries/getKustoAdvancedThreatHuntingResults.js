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
          },
          options
        })),
        async (advancedThreatHuntingKustoQueryRequests) =>
          map(
            (request) => ({
              entity: request.entity,
              result: [
                {
                  schema: [
                    {
                      Name: 'Timestamp',
                      Type: 'DateTime'
                    },
                    {
                      Name: 'FileName',
                      Type: 'String'
                    },
                    {
                      Name: 'InitiatingProcessFileName',
                      Type: 'String'
                    }
                  ],
                  results: [
                    {
                      Timestamp: '2020-08-30T06:38:35.7664356Z',
                      FileName: 'conhost.exe',
                      InitiatingProcessFileName: 'powershell.exe'
                    },
                    {
                      Timestamp: '2020-08-30T06:38:30.5163363Z',
                      FileName: 'conhost.exe',
                      InitiatingProcessFileName: 'powershell.exe'
                    }
                  ]
                },
                {
                  schema: [
                    {
                      Name: 'Timestamp',
                      Type: 'DateTime'
                    },
                    {
                      Name: 'FileName',
                      Type: 'String'
                    },
                    {
                      Name: 'InitiatingProcessFileName',
                      Type: 'String'
                    }
                  ],
                  results: [
                    {
                      Timestamp: '2020-08-30T06:38:35.7664356Z',
                      FileName: 'conhost.exe',
                      InitiatingProcessFileName: 'powershell.exe'
                    },
                    {
                      Timestamp: '2020-08-30T06:38:30.5163363Z',
                      FileName: 'conhost.exe',
                      InitiatingProcessFileName: 'powershell.exe'
                    }
                  ]
                }
              ]
            }),
            advancedThreatHuntingKustoQueryRequests
          ) //          await requestsInParallel(advancedThreatHuntingKustoQueryRequests, 'body')
      )(entities)
    : [];

const escapeQuotes = replace(/(\r\n|\n|\r)/gm, '');

module.exports = getKustoAdvancedThreatHuntingResults;
