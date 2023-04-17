# Polarity Microsoft 365 Defender Integration

![image](https://img.shields.io/badge/status-beta-green.svg)

Microsoft 365 Defender is a unified pre- and post-breach enterprise defense suite that natively coordinates detection, prevention, investigation, and response across endpoints, identities, email, and applications to provide integrated protection against sophisticated attacks.

The Polarity Microsoft 365 Defender Integration allows you to search for Alerts and Incidents by Emails, along with the ability to run Advanced Threat Hunting Kusto Queries from Microsoft 365 Defender.


To learn more about Microsoft 365 Defender, visit the [official website](https://learn.microsoft.com/en-us/microsoft-365/security/defender/microsoft-365-defender?view=o365-worldwide).


## Microsoft 365 Defender Integration Options
### Azure AD Registered App Client/Application ID
Your Azure AD Registered App's Client ID associated with your Microsoft 365 Defender Instance

### Azure AD Registered App Tenant/Directory ID
Your Azure AD Registered App's Tenant ID associated with your Microsoft 365 Defender Instance.

### Azure AD Registered App Client Secret
Your Azure AD Registered App's Client Secret associated with your Microsoft 365 Defender Instance.

### Advanced Threat Hunting Kusto Query String
Kusto Query String to execute for Advanced Threat Hunting. All available tables include AlertInfo, AlertEvidence, IdentityInfo, EmailAttachmentInfo, EmailUrlInfo, EmailPostDeliveryEvents, & UrlClickEvents. Example: `union withsource=SourceTable AlertInfo, AlertEvidence | search "{{ENTITY}}" | where Timestamp >= ago(1000d) | take 10`

### Advanced Threat Hunting Summary Fields
Comma delimited list of field values to include as part of the summary.  These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".

### Advanced Threat Hunting Ignore Fields
Comma delimited list of Fields to not show from the Advanced Threat Hunting Results in the Overlay. This option must be set to "User can view and edit" or "User can view only".

### Ignore Classifications
Comma delimited list of Classifications that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".

### Ignore Determinations
Comma delimited list of Determinations that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".

### Ignore Severities
Comma delimited list of Severities that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".

### Ignore Statuses
Comma delimited list of Statuses that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".

### Ignore Service Sources
Comma delimited list of Service Sources that if found in Incidents or Alerts will not show up in search results. This option must be set to "User can view and edit" or "User can view only".

### Created On Lookback Days
The number of days from today which Incidents or Alerts results will be returned based on when it was Created.

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).


## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
