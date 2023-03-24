module.exports = {
  name: 'Microsoft Defender',
  acronym: 'MS-DEF',
  description:
    'TODO',
  entityTypes: ['domain', 'IPv4', 'email', 'hash', 'cve'], //TODO
  styles: ['./client/styles.less'],
  defaultColor: 'light-blue',
  block: {
    component: {
      file: './client/block.js'
    },
    template: {
      file: './client/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: '',
    rejectUnauthorized: true
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'clientId',
      name: 'Azure AD Registered App Client/Application ID',
      description:
        "Your Azure AD Registered App's Client ID associated with your Microsoft 365 Defender Instance.",
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'tenantId',
      name: 'Azure AD Registered App Tenant/Directory ID',
      description:
        "Your Azure AD Registered App's Tenant ID associated with your Microsoft 365 Defender Instance.",
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Azure AD Registered App Client Secret',
      description:
        "Your Azure AD Registered App's Client Secret associated with your Microsoft 365 Defender Instance.",
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'kustoQueryString',
      name: 'Kusto Query String',
      description:
        'Kusto Query String to execute on the 365 Defender Log Analytics Workspace. The string `{{ENTITY}}` will be replace by the looked up Entity. For example: ThreatIntelligenceIndicator | search "{{ENTITY}}" | take 10',
      default: 'ThreatIntelligenceIndicator | search "{{ENTITY}}" | take 10',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'kustoQuerySummaryFields',
      name: 'Kusto Query Summary Fields',
      description:
        'Comma delimited list of field values to include as part of the summary.  These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'kustoQueryIgnoreFields',
      name: 'Kusto Query Ignore Fields',
      description:
        'Comma delimited list of Fields to ignore from the Kusto Query Results in the Overlay. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'lookbackDays',
      name: 'Lookback Days',
      description: 'The number of days to look back when querying logs, and incidents.',
      default: 30,
      type: 'number',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
