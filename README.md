# Polarity Microsoft 365 Defender Integration

![image](https://img.shields.io/badge/status-beta-green.svg)

Microsoft 365 Defender is a unified pre- and post-breach enterprise defense suite that natively coordinates detection, prevention, investigation, and response across endpoints, identities, email, and applications to provide integrated protection against sophisticated attacks.

The Polarity Microsoft 365 Defender Integration allows you to search for Emails assigned to Alerts, Incidents, and Devices, along with the ability to run Advanced Threat Hunting Kusto Queries on all entity types from Microsoft 365 Defender.

You can also optionally enable Device Isolation and File Quarantine for Device and Alert Found Files.

To learn more about Microsoft 365 Defender, visit the [official website](https://learn.microsoft.com/en-us/microsoft-365/security/defender/microsoft-365-defender?view=o365-worldwide).

> ***NOTE:*** Instructions on how to setup your Azure Instance and User Options for the integration are found below in the [Microsoft 365 Defender Azure Integration Setup](#microsoft-365-defender-azure-integration-setup) section below.


## Microsoft Defender Integration Options

### Azure AD Registered App Client/Application ID
Your Azure AD Registered App's Client ID associated with your Microsoft 365 Defender Instance.

### Azure AD Registered App Tenant/Directory ID
Your Azure AD Registered App's Tenant ID associated with your Microsoft 365 Defender Instance.

### Azure AD Registered App Client Secret
Your Azure AD Registered App's Client Secret associated with your Microsoft 365 Defender Instance.

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
Comma delimited list of field values to include as part of the summary.  These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".

### Advanced Threat Hunting Ignore Fields
Comma delimited list of Fields to not show from the Advanced Threat Hunting Results in the Overlay. This option must be set to "User can view and edit" or "User can view only".

### Enable File Isolation
Enable File Isolation for Files found in Alerts

### Enable Device Isolation
Enable Device Isolation for found Device

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

## Microsoft 365 Defender Azure Integration Setup
### _Create App Registration_
**1**. Navigate to App Registrations
    <div style="margin-bottom: 10px;">
      <img alt="Navigate to App Registrations on Azure" src="./assets/nav-to-app-reg.png">
    </div>

**2**. Select `New registration`
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="Select `New registration`" src="./assets/select-new-reg.png">
    </div>

**3**. Add a memorable name for the new registration then click `Register`
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="Memorable Name & Click `Register`" src="./assets/mem-name-click-register.png">
    </div>

### _Setup API Permissions_
#### _Our end goal for this section is to have all of these permissions granted with Admin Consent.  More Detailed steps are listed below._

<div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
  <img width="700px" src="./assets/admin-consent-granted.png">
</div>

> **_NOTE:_** The permissions `Machine.Isolate` & `Machine.StopAndQuarantine` are optional, and only need to be added if you wish to `Enable Device Isolation` or `Enable File Isolation` in the Polarity User Options for the integration.

**4**. In your newly created app registration, navigate to `API permissions` in the left hand menu, then click `Add a permission` for each of the permissions listed below
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/click-add-permission.png">
    </div>

**5**. Click `Microsoft Graph`
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/click-microsoft-graph.png">
    </div>
Under `Application permissions`
- Search for `SecurityIncident` and select `SecurityIncident.Read.All` then click `Add permissions` 
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/select-security-incident-permission.png">
    </div>
- Search for `SecurityAlert` and select `SecurityAlert.Read.All` then click `Add permissions` 
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/select-security-alert-permission.png">
    </div>
- Search for `ThreatHunting` and select `ThreatHunting.Read.All` then click `Add permissions`
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/select-threat-hunting-permission.png">
    </div>

**6**. Under `APIs my organization uses` search for and click `WindowsDefenderATP`
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/click-windows-defender-atp-permission.png">
    </div>
Under `Application permissions`
- Search for `Alert` and select `Alert.ReadWrite.All` then click `Add permissions` 
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/select-alert-permission.png">
    </div>
- Search for `Machine` and select `Machine.ReadWrite.All` then click `Add permissions` 
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/select-machine-permission.png">
    </div>
- If you want to Quarantine Files using the integration, then Search for `Machine` and select `Machine.StopAndQuarantine` then click `Add permissions`, and when working on the `Add User Options to Integration` section below make sure turn on and save the `Enable File Isolation` user option in Polarity.
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="63%" src="./assets/select-stop-and-quarantine-permission.png">
      <img width="36%" src="./assets/enable-file-isolation.png">
    </div>
- If you want to Isolate Devices using the integration, then Search for `Machine` and select `Machine.Isolate` then click `Add permissions`, and when working on the `Add User Options to Integration` section below make sure turn on and save the `Enable Device Isolation` user option in Polarity.
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="63%" src="./assets/select-machine-isolation-permission.png">
      <img width="36%" src="./assets/enable-device-isolation.png">
    </div>

**7**. Click `Grant admin consent for <tenant name>`
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/grant-admin-consent.png">
    </div>
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="700px" src="./assets/admin-consent-granted.png">
    </div>

**8**. Wait a few minutes for the permissions to propagate before moving on to add your User Options to the Integration.

### _Add User Options to Integration_
**9**. Navigate to the `Overview` tab in the left hand menu, then copy the `Application (client) ID` & `Directory (tenant) ID` to the relevant Polarity User Options
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="63%" alt="Copy Client & Tenant IDs" src="./assets/copy-client-and-tenant-ids.png">
      <img width="35%" alt="Paste Client & Tenant IDs to User Options" src="./assets/paste-client-and-tenant-ids.png">
    </div>

**10**. Click the `Add certificate or secret` link
    <div style="margin-bottom: 10px;">
      <img alt="Add certificate or secret" src="./assets/add-cert-or-secret-link.png">
    </div>

**11**. Click `New client secret` 
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="New client secret" src="./assets/new-client-secret.png">
    </div>

**12**. Add your desired secret key description then click `Add`
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="Secret Description & Add" src="./assets/secret-desc-and-add.png">
    </div>

**13**. Copy your new client secret `Value` (_Not ID_) to the relevant Polarity User Option
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="63%" alt="Copy Secret Value" src="./assets/copy-secret-value.png">
      <img width="36%" alt="Paste Secret Value to User Options" src="./assets/paste-secret-value.png">
    </div>

**13**. Make sure to Click `Save Configuration Changes` for your Polarity User Options.  It may take a few seconds for the options to save.

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making. For more information about the Polarity platform please see:

https://polarity.io/
