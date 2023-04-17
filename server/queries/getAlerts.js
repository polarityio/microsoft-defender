const { flow, filter, get, map } = require('lodash/fp');
const { MAX_PAGE_SIZE } = require('../constants');
const { requestsInParallel } = require('../request');
const { createFiltersFromUserOptions } = require('./common');

const getAlerts = async (entities, options) =>
  flow(
    filter(get('isEmail')),
    createFiltersFromUserOptions(options),
    map(({ emailEntity, userOptionBasedFilters }) => ({
      entity: emailEntity,
      method: 'GET',
      route: 'alerts_v2',
      qs: {
        $filter: `assignedTo eq '${emailEntity.value}'${userOptionBasedFilters}`,
        $top: MAX_PAGE_SIZE
      },
      options
    })),
    async (alertRequests) =>
      map(
        (request) => ({
          entity: request.entity,
          result: [
            {
              '@odata.type': '#microsoft.graph.security.alert',
              id: 'da637551227677560813_-961444813',
              providerAlertId: 'da637551227677560813_-961444813',
              incidentId: '28282',
              status: 'new',
              severity: 'low',
              classification: 'unknown',
              determination: 'unknown',
              serviceSource: 'microsoftDefenderForEndpoint',
              detectionSource: 'antivirus',
              detectorId: 'e0da400f-affd-43ef-b1d5-afc2eb6f2756',
              tenantId: 'b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              title: 'Suspicious execution of hidden file',
              description:
                'A hidden file has been launched. This activity could indicate a compromised host. Attackers often hide files associated with malicious tools to evade file system inspection and defenses.',
              recommendedActions:
                'Collect artifacts and determine scope\n�\tReview the machine timeline for suspicious activities that may have occurred before and after the time of the alert, and record additional related artifacts (files, IPs/URLs) \n�\tLook for the presence of relevant artifacts on other systems. Identify commonalities and differences between potentially compromised systems.\n�\tSubmit relevant files for deep analysis and review resulting detailed behavioral information.\n�\tSubmit undetected files to the MMPC malware portal\n\nInitiate containment & mitigation \n�\tContact the user to verify intent and initiate local remediation actions as needed.\n�\tUpdate AV signatures and run a full scan. The scan might reveal and remove previously-undetected malware components.\n�\tEnsure that the machine has the latest security updates. In particular, ensure that you have installed the latest software, web browser, and Operating System versions.\n�\tIf credential theft is suspected, reset all relevant users passwords.\n�\tBlock communication with relevant URLs or IPs at the organization�s perimeter.',
              category: 'DefenseEvasion',
              assignedTo: null,
              alertWebUrl:
                'https://security.microsoft.com/alerts/da637551227677560813_-961444813?tid=b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              incidentWebUrl:
                'https://security.microsoft.com/incidents/28282?tid=b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              actorDisplayName: null,
              threatDisplayName: null,
              threatFamilyName: null,
              mitreTechniques: ['T1564.001'],
              createdDateTime: '2021-04-27T12:19:27.7211305Z',
              lastUpdateDateTime: '2021-05-02T14:19:01.3266667Z',
              resolvedDateTime: null,
              firstActivityDateTime: '2021-04-26T07:45:50.116Z',
              lastActivityDateTime: '2021-05-02T07:56:58.222Z',
              comments: [ {
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
              },],
              evidence: [
                {
                  '@odata.type': '#microsoft.graph.security.deviceEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  firstSeenDateTime: '2020-09-12T07:28:32.4321753Z',
                  mdeDeviceId: '73e7e2de709dff64ef64b1d0c30e67fab63279db',
                  azureAdDeviceId: null,
                  deviceDnsName: 'tempDns',
                  osPlatform: 'Windows10',
                  osBuild: 22424,
                  version: 'Other',
                  healthStatus: 'active',
                  riskScore: 'medium',
                  rbacGroupId: 75,
                  rbacGroupName: 'UnassignedGroup',
                  onboardingStatus: 'onboarded',
                  defenderAvStatus: 'unknown',
                  loggedOnUsers: [],
                  roles: ['compromised'],
                  tags: ['Test Machine'],
                  vmMetadata: {
                    vmId: 'ca1b0d41-5a3b-4d95-b48b-f220aed11d78',
                    cloudProvider: 'azure',
                    resourceId:
                      '/subscriptions/8700d3a3-3bb7-4fbe-a090-488a1ad04161/resourceGroups/WdatpApi-EUS-STG/providers/Microsoft.Compute/virtualMachines/NirLaviTests',
                    subscriptionId: '8700d3a3-3bb7-4fbe-a090-488a1ad04161'
                  }
                },
                {
                  '@odata.type': '#microsoft.graph.security.fileEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  detectionStatus: 'detected',
                  mdeDeviceId: '73e7e2de709dff64ef64b1d0c30e67fab63279db',
                  roles: [],
                  tags: [],
                  fileDetails: {
                    sha1: '5f1e8acedc065031aad553b710838eb366cfee9a',
                    sha256:
                      '8963a19fb992ad9a76576c5638fd68292cffb9aaac29eb8285f9abf6196a7dec',
                    fileName: 'MsSense.exe',
                    filePath: 'C:\\Program Files\\temp',
                    fileSize: 6136392,
                    filePublisher: 'Microsoft Corporation',
                    signer: null,
                    issuer: null
                  }
                },
                {
                  '@odata.type': '#microsoft.graph.security.processEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  processId: 4780,
                  parentProcessId: 668,
                  processCommandLine: '"MsSense.exe"',
                  processCreationDateTime: '2021-08-12T12:43:19.0772577Z',
                  parentProcessCreationDateTime: '2021-08-12T07:39:09.0909239Z',
                  detectionStatus: 'detected',
                  mdeDeviceId: '73e7e2de709dff64ef64b1d0c30e67fab63279db',
                  roles: [],
                  tags: [],
                  imageFile: {
                    sha1: '5f1e8acedc065031aad553b710838eb366cfee9a',
                    sha256:
                      '8963a19fb992ad9a76576c5638fd68292cffb9aaac29eb8285f9abf6196a7dec',
                    fileName: 'MsSense.exe',
                    filePath: 'C:\\Program Files\\temp',
                    fileSize: 6136392,
                    filePublisher: 'Microsoft Corporation',
                    signer: null,
                    issuer: null
                  },
                  parentProcessImageFile: {
                    sha1: null,
                    sha256: null,
                    fileName: 'services.exe',
                    filePath: 'C:\\Windows\\System32',
                    fileSize: 731744,
                    filePublisher: 'Microsoft Corporation',
                    signer: null,
                    issuer: null
                  },
                  userAccount: {
                    accountName: 'SYSTEM',
                    domainName: 'NT AUTHORITY',
                    userSid: 'S-1-5-18',
                    azureAdUserId: null,
                    userPrincipalName: null
                  }
                },
                {
                  '@odata.type': '#microsoft.graph.security.registryKeyEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  registryKey:
                    'SYSTEM\\CONTROLSET001\\CONTROL\\WMI\\AUTOLOGGER\\SENSEAUDITLOGGER',
                  registryHive: 'HKEY_LOCAL_MACHINE',
                  roles: [],
                  tags: []
                }
              ]
            },
            {
              '@odata.type': '#microsoft.graph.security.alert',
              id: 'da637551227677560813_-961444813',
              providerAlertId: 'da637551227677560813_-961444813',
              incidentId: '28282',
              status: 'new',
              severity: 'low',
              classification: 'unknown',
              determination: 'unknown',
              serviceSource: 'microsoftDefenderForEndpoint',
              detectionSource: 'antivirus',
              detectorId: 'e0da400f-affd-43ef-b1d5-afc2eb6f2756',
              tenantId: 'b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              title: 'Suspicious execution of hidden file',
              description:
                'A hidden file has been launched. This activity could indicate a compromised host. Attackers often hide files associated with malicious tools to evade file system inspection and defenses.',
              recommendedActions:
                'Collect artifacts and determine scope\n�\tReview the machine timeline for suspicious activities that may have occurred before and after the time of the alert, and record additional related artifacts (files, IPs/URLs) \n�\tLook for the presence of relevant artifacts on other systems. Identify commonalities and differences between potentially compromised systems.\n�\tSubmit relevant files for deep analysis and review resulting detailed behavioral information.\n�\tSubmit undetected files to the MMPC malware portal\n\nInitiate containment & mitigation \n�\tContact the user to verify intent and initiate local remediation actions as needed.\n�\tUpdate AV signatures and run a full scan. The scan might reveal and remove previously-undetected malware components.\n�\tEnsure that the machine has the latest security updates. In particular, ensure that you have installed the latest software, web browser, and Operating System versions.\n�\tIf credential theft is suspected, reset all relevant users passwords.\n�\tBlock communication with relevant URLs or IPs at the organization�s perimeter.',
              category: 'DefenseEvasion',
              assignedTo: null,
              alertWebUrl:
                'https://security.microsoft.com/alerts/da637551227677560813_-961444813?tid=b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              incidentWebUrl:
                'https://security.microsoft.com/incidents/28282?tid=b3c1b5fc-828c-45fa-a1e1-10d74f6d6e9c',
              actorDisplayName: null,
              threatDisplayName: null,
              threatFamilyName: null,
              mitreTechniques: ['T1564.001'],
              createdDateTime: '2021-04-27T12:19:27.7211305Z',
              lastUpdateDateTime: '2021-05-02T14:19:01.3266667Z',
              resolvedDateTime: null,
              firstActivityDateTime: '2021-04-26T07:45:50.116Z',
              lastActivityDateTime: '2021-05-02T07:56:58.222Z',
              comments: [],
              evidence: [
                {
                  '@odata.type': '#microsoft.graph.security.deviceEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  firstSeenDateTime: '2020-09-12T07:28:32.4321753Z',
                  mdeDeviceId: '73e7e2de709dff64ef64b1d0c30e67fab63279db',
                  azureAdDeviceId: null,
                  deviceDnsName: 'tempDns',
                  osPlatform: 'Windows10',
                  osBuild: 22424,
                  version: 'Other',
                  healthStatus: 'active',
                  riskScore: 'medium',
                  rbacGroupId: 75,
                  rbacGroupName: 'UnassignedGroup',
                  onboardingStatus: 'onboarded',
                  defenderAvStatus: 'unknown',
                  loggedOnUsers: [],
                  roles: ['compromised'],
                  tags: ['Test Machine'],
                  vmMetadata: {
                    vmId: 'ca1b0d41-5a3b-4d95-b48b-f220aed11d78',
                    cloudProvider: 'azure',
                    resourceId:
                      '/subscriptions/8700d3a3-3bb7-4fbe-a090-488a1ad04161/resourceGroups/WdatpApi-EUS-STG/providers/Microsoft.Compute/virtualMachines/NirLaviTests',
                    subscriptionId: '8700d3a3-3bb7-4fbe-a090-488a1ad04161'
                  }
                },
                {
                  '@odata.type': '#microsoft.graph.security.fileEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  detectionStatus: 'detected',
                  mdeDeviceId: '73e7e2de709dff64ef64b1d0c30e67fab63279db',
                  roles: [],
                  tags: [],
                  fileDetails: {
                    sha1: '5f1e8acedc065031aad553b710838eb366cfee9a',
                    sha256:
                      '8963a19fb992ad9a76576c5638fd68292cffb9aaac29eb8285f9abf6196a7dec',
                    fileName: 'MsSense.exe',
                    filePath: 'C:\\Program Files\\temp',
                    fileSize: 6136392,
                    filePublisher: 'Microsoft Corporation',
                    signer: null,
                    issuer: null
                  }
                },
                {
                  '@odata.type': '#microsoft.graph.security.processEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  processId: 4780,
                  parentProcessId: 668,
                  processCommandLine: '"MsSense.exe"',
                  processCreationDateTime: '2021-08-12T12:43:19.0772577Z',
                  parentProcessCreationDateTime: '2021-08-12T07:39:09.0909239Z',
                  detectionStatus: 'detected',
                  mdeDeviceId: '73e7e2de709dff64ef64b1d0c30e67fab63279db',
                  roles: [],
                  tags: [],
                  imageFile: {
                    sha1: '5f1e8acedc065031aad553b710838eb366cfee9a',
                    sha256:
                      '8963a19fb992ad9a76576c5638fd68292cffb9aaac29eb8285f9abf6196a7dec',
                    fileName: 'MsSense.exe',
                    filePath: 'C:\\Program Files\\temp',
                    fileSize: 6136392,
                    filePublisher: 'Microsoft Corporation',
                    signer: null,
                    issuer: null
                  },
                  parentProcessImageFile: {
                    sha1: null,
                    sha256: null,
                    fileName: 'services.exe',
                    filePath: 'C:\\Windows\\System32',
                    fileSize: 731744,
                    filePublisher: 'Microsoft Corporation',
                    signer: null,
                    issuer: null
                  },
                  userAccount: {
                    accountName: 'SYSTEM',
                    domainName: 'NT AUTHORITY',
                    userSid: 'S-1-5-18',
                    azureAdUserId: null,
                    userPrincipalName: null
                  }
                },
                {
                  '@odata.type': '#microsoft.graph.security.registryKeyEvidence',
                  createdDateTime: '2021-04-27T12:19:27.7211305Z',
                  verdict: 'unknown',
                  remediationStatus: 'none',
                  remediationStatusDetails: null,
                  registryKey:
                    'SYSTEM\\CONTROLSET001\\CONTROL\\WMI\\AUTOLOGGER\\SENSEAUDITLOGGER',
                  registryHive: 'HKEY_LOCAL_MACHINE',
                  roles: [],
                  tags: []
                }
              ]
            }
          ]
        }),
        alertRequests
      ) //await requestsInParallel(alertRequests, 'body.value')
  )(entities);

module.exports = getAlerts;
