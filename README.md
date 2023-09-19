# Polarity Microsoft 365 Defender Integration

![image](https://img.shields.io/badge/status-beta-green.svg)

Microsoft 365 Defender is a unified pre- and post-breach enterprise defense suite that natively coordinates detection, prevention, investigation, and response across endpoints, identities, email, and applications to provide integrated protection against sophisticated attacks.

TODO: Update features description and other premissions needed for isolation
The Polarity Microsoft 365 Defender Integration allows you to search for Emails assigned to Alerts and Incidents, along with the ability to run Advanced Threat Hunting Kusto Queries on all entity types from Microsoft 365 Defender.

To learn more about Microsoft 365 Defender, visit the [official website](https://learn.microsoft.com/en-us/microsoft-365/security/defender/microsoft-365-defender?view=o365-worldwide).

> ***NOTE:*** The permissions required on your `App Registration`  which you obtain your `Client/Application ID`, `Tenant/Directory ID`, & `Client Secret` User Options from need to be `SecurityIncident.Read.All`, `ThreatHunting.Read.All` & `User.Read`


## Microsoft 365 Defender Integration Options

### Azure AD Registered App Client/Application ID

Your Azure AD Registered App's Client ID associated with your Microsoft 365 Defender Instance

### Azure AD Registered App Tenant/Directory ID

Your Azure AD Registered App's Tenant ID associated with your Microsoft 365 Defender Instance.

### Azure AD Registered App Client Secret

Your Azure AD Registered App's Client Secret associated with your Microsoft 365 Defender Instance.

### Advanced Threat Hunting Kusto Query String

Kusto Query String to execute for Advanced Threat Hunting. All available tables can be found [HERE](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-schema-tables?view=o365-worldwide). Example: `union withsource=SourceTable AlertInfo, AlertEvidence | search "{{ENTITY}}" | where Timestamp >= ago(30d) | take 10`

> **_NOTE:_** According to the documentation found [HERE](https://learn.microsoft.com/en-us/graph/api/resources/security-api-overview?view=graph-rest-1.0#advanced-hunting), the max time you can look back is 30d.

***Available Tables***

```AlertEvidence, AlertInfo, DeviceEvents, DeviceFileCertificateInfo, DeviceFileEvents, DeviceImageLoadEvents, DeviceInfo, DeviceLogonEvents, DeviceNetworkEvents, DeviceNetworkInfo, DeviceProcessEvents, DeviceRegistryEvents, DeviceTvmSecureConfigurationAssessment, DeviceTvmSecureConfigurationAssessmentKB, DeviceTvmSoftwareInventory, DeviceTvmSoftwareVulnerabilities, DeviceTvmSoftwareVulnerabilitiesKB, EmailAttachmentInfo, EmailEvents, EmailPostDeliveryEvents, EmailUrlInfo, IdentityInfo```

| Table Name | Description |
| ---------- | ----------- |
| **[AlertEvidence](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-alertevidence-table?view=o365-worldwide)** | Files, IP addresses, URLs, users, or devices associated with alerts |
| **[AlertInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-alertinfo-table?view=o365-worldwide)** | Alerts from Microsoft Defender for Endpoint, Microsoft Defender for Office 365, Microsoft Defender for Cloud Apps, and Microsoft Defender for Identity, including severity information and threat categorization |
| **[DeviceEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-deviceevents-table?view=o365-worldwide)** | Multiple event types, including events triggered by security controls such as Microsoft Defender Antivirus and exploit protection |
| **[DeviceFileCertificateInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicefilecertificateinfo-table?view=o365-worldwide)** | Certificate information of signed files obtained from certificate verification events on endpoints |
| **[DeviceFileEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicefileevents-table?view=o365-worldwide)** | File creation, modification, and other file system events |
| **[DeviceImageLoadEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-deviceimageloadevents-table?view=o365-worldwide)** | DLL loading events |
| **[DeviceInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-deviceinfo-table?view=o365-worldwide)** | Machine information, including OS information |
| **[DeviceLogonEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicelogonevents-table?view=o365-worldwide)** | Sign-ins and other authentication events on devices |
| **[DeviceNetworkEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicenetworkevents-table?view=o365-worldwide)** | Network connection and related events |
| **[DeviceNetworkInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicenetworkinfo-table?view=o365-worldwide)** | Network properties of devices, including physical adapters, IP and MAC addresses, as well as connected networks and domains |
| **[DeviceProcessEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-deviceprocessevents-table?view=o365-worldwide)** | Process creation and related events |
| **[DeviceRegistryEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-deviceregistryevents-table?view=o365-worldwide)** | Creation and modification of registry entries |
| **[DeviceTvmSecureConfigurationAssessment](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicetvmsecureconfigurationassessment-table?view=o365-worldwide)** | Microsoft Defender Vulnerability Management assessment events, indicating the status of various security configurations on devices |
| **[DeviceTvmSecureConfigurationAssessmentKB](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicetvmsecureconfigurationassessmentkb-table?view=o365-worldwide)** | Knowledge base of various security configurations used by Microsoft Defender Vulnerability Management to assess devices; includes mappings to various standards and benchmarks |
| **[DeviceTvmSoftwareInventory](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicetvmsoftwareinventory-table?view=o365-worldwide)** | Inventory of software installed on devices, including their version information and end-of-support status |
| **[DeviceTvmSoftwareVulnerabilities](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicetvmsoftwarevulnerabilities-table?view=o365-worldwide)** | Software vulnerabilities found on devices and the list of available security updates that address each vulnerability |
| **[DeviceTvmSoftwareVulnerabilitiesKB](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-devicetvmsoftwarevulnerabilitieskb-table?view=o365-worldwide)** | Knowledge base of publicly disclosed vulnerabilities, including whether exploit code is publicly available |
| **[EmailAttachmentInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-emailattachmentinfo-table?view=o365-worldwide)** | Information about files attached to emails |
| **[EmailEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-emailevents-table?view=o365-worldwide)** | Microsoft 365 email events, including email delivery and blocking events |
| **[EmailPostDeliveryEvents](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-emailpostdeliveryevents-table?view=o365-worldwide)** | Security events that occur post-delivery, after Microsoft 365 has delivered the emails to the recipient mailbox |
| **[EmailUrlInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-emailurlinfo-table?view=o365-worldwide)** | Information about URLs on emails |
| **[IdentityInfo](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-identityinfo-table?view=o365-worldwide)** | Account information from various sources, including Azure Active Directory |

### Advanced Threat Hunting Summary Fields

Comma delimited list of field values to include as part of the summary. These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".

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

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making. For more information about the Polarity platform please see:

https://polarity.io/
