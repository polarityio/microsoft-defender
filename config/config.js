module.exports = {
  name: 'Microsoft Defender',
  acronym: 'MS-DEF',
  description: 'Search for Alerts and Incidents by Emails, along with the ability to run Advanced Threat Hunting Kusto Queries',
  entityTypes: ['*'],
  defaultColor: 'light-blue',
  styles: ['./client/styles.less'],
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
      name: 'Advanced Threat Hunting Kusto Query String',
      description:
        'Kusto Query String to execute for Advanced Threat Hunting. All available tables include AlertInfo, AlertEvidence, IdentityInfo, EmailAttachmentInfo, EmailUrlInfo, EmailPostDeliveryEvents, & UrlClickEvents. Example: "union withsource=SourceTable AlertInfo, AlertEvidence | search "{{ENTITY}}" | where Timestamp >= ago(1000d) | take 10"',
      default: 'union withsource=SourceTable AlertInfo, AlertEvidence | search "{{ENTITY}}" | where Timestamp >= ago(60d)| take 10',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'kustoQuerySummaryFields',
      name: 'Advanced Threat Hunting Summary Fields',
      description:
        'Comma delimited list of field values to include as part of the summary.  These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'kustoQueryIgnoreFields',
      name: 'Advanced Threat Hunting Ignore Fields',
      description:
        'Comma delimited list of Fields to not show from the Advanced Threat Hunting Results in the Overlay. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ignoreClassifications',
      name: 'Ignore Classifications',
      description: 'Comma delimited list of Classifications that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ignoreDeterminations',
      name: 'Ignore Determinations',
      description: 'Comma delimited list of Determinations that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ignoreSeverities',
      name: 'Ignore Severities',
      description: 'Comma delimited list of Severities that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ignoreStatuses',
      name: 'Ignore Statuses',
      description: 'Comma delimited list of Statuses that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ignoreServiceSources',
      name: 'Ignore Service Sources',
      description: 'Comma delimited list of Service Sources that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'createdLookbackDays',
      name: 'Created On Lookback Days',
      description: 'The number of days from today which Incidents or Alerts results will be returned based on when it was Created.',
      default: 60,
      type: 'number',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
