const { size, flow, compact, map, get, flatten } = require('lodash/fp');
const { parseErrorToReadableJson } = require('../dataTransformations');
const { getLogger } = require('../logging');
const { getIncidents } = require('../queries');
const { requestWithDefaults } = require('../request');
const parseUserOptions = require('./parseUserOptions');
const { validateStringOptions, flattenOptions, validateUrlOption } = require('./utils');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    graphApiUrl: '* Required',
    microsoft365ApiUrl: '* Required',
    clientId: '* Required',
    tenantId: '* Required',
    clientSecret: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const urlOptionsErrors = validateUrlOption(options, 'graphApiUrl').concat(
    validateUrlOption(options, 'microsoft365ApiUrl')
  );

  const parsedOptions = flow(flattenOptions, parseUserOptions)(options);

  const authenticationError = !size(stringValidationErrors)
    ? await validateAuthentication(parsedOptions)
    : [];

  let errors = stringValidationErrors
    .concat(urlOptionsErrors)
    .concat(authenticationError);

  const filterOptionErrors = !size(errors)
    ? flatten(
        await Promise.all([
          validateFilterOption(
            'ignoreClassifications',
            'parsedIgnoreClassifications',
            parsedOptions
          ),
          validateFilterOption(
            'ignoreDeterminations',
            'parsedIgnoreDeterminations',
            parsedOptions
          ),
          validateFilterOption(
            'ignoreSeverities',
            'parsedIgnoreSeverities',
            parsedOptions
          ),
          validateFilterOption('ignoreStatuses', 'parsedIgnoreStatuses', parsedOptions),
          validateFilterOption(
            'ignoreServiceSources',
            'parsedIgnoreServiceSources',
            parsedOptions
          )
        ])
      )
    : [];

  const lookbackDaysError =
    options.createdLookbackDays.value <= 0
      ? [{ key: 'createdLookbackDays', message: 'Must be greater than 0' }]
      : [];

  callback(null, errors.concat(filterOptionErrors).concat(lookbackDaysError));
};

const validateAuthentication = async (options) => {
  try {
    await requestWithDefaults({
      method: 'GET',
      site: 'graph',
      route: 'incidents',
      qs: { $top: 1 },
      options
    });
    return [];
  } catch (error) {
    getLogger().error(
      { error, formattedError: parseErrorToReadableJson(error) },
      'Authentication Failed'
    );
    const message = `Authentication Failed: ${error.message}`;
    return [
      { key: 'clientId', message },
      { key: 'tenantId', message },
      { key: 'clientSecret', message }
    ];
  }
};

const validateFilterOption = async (filterOptionKey, parsedFilterOptionKey, options) =>
  compact(
    await Promise.all(
      map(async (filterOptionValue) => {
        try {
          await getIncidents([{ isEmail: true, value: 'test@polarity.io' }], {
            ...options,
            parsedIgnoreClassifications: [],
            parsedIgnoreDeterminations: [],
            parsedIgnoreSeverities: [],
            parsedIgnoreStatuses: [],
            parsedIgnoreServiceSources: [],
            [parsedFilterOptionKey]: [filterOptionValue]
          });
        } catch (error) {
          getLogger().error(
            { error, formattedError: parseErrorToReadableJson(error) },
            `Filter option ${filterOptionKey} is not a valid possibility`
          );
          return {
            key: filterOptionKey,
            message: `* \`${filterOptionValue}\` is not a valid possible value for this Ignore Option`
          };
        }
      }, get(parsedFilterOptionKey, options))
    )
  );

module.exports = validateOptions;
