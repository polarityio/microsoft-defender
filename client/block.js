polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  activeTab: '',
  expandableTitleStates: Ember.computed.alias('block._state.expandableTitleStates'),
  quarantineFileSuccessMessage: Ember.computed.alias(
    'block._state.quarantineFileSuccessMessage'
  ),
  quarantineFileErrorMessage: Ember.computed.alias(
    'block._state.quarantineFileErrorMessage'
  ),
  changeIsolationStatusErrorMessage: Ember.computed.alias(
    'block._state.changeIsolationStatusErrorMessage'
  ),
  showRefreshCheckmark: Ember.computed.alias('block._state.showRefreshCheckmark'),
  displayTabNames: {
    incidents: 'Incidents',
    alerts: 'Alerts',
    devices: 'Devices',
    kustoQueryResults: 'Advanced Threat Hunting'
  },
  init() {
    const details = this.get('details');

    this.set(
      'activeTab',
      details.incidents && details.incidents.length
        ? 'incidents'
        : details.alerts && details.alerts.length
        ? 'alerts'
        : details.devices && details.devices.length
        ? 'devices'
        : 'kustoQueryResults'
    );

    if (!this.get('block._state')) {
      this.set('block._state', {});
      this.set('block._state.changeIsolationStatusErrorMessage', {});
      this.set('block._state.quarantineFileSuccessMessage', {});
      this.set('block._state.quarantineFileErrorMessage', {});
      this.set('block._state.showRefreshCheckmark', {});
      this.set('block._state.expandableTitleStates', {
        kustoQueryResults: {
          0: !(details.kustoQueryResults && details.kustoQueryResults.length > 1)
        }
      });
    }
    this._super(...arguments);
  },
  actions: {
    changeTab: function (tabName) {
      if (tabName === 'devices' && this.get('block.userOptions.enableMachinesIsolation'))
        this.checkIfDevicesIsolationIsPending();

      this.set('activeTab', tabName);
    },
    toggleExpandableTitle: function (index, type) {
      this.set(
        `block._state.expandableTitleStates`,
        Object.assign({}, this.get('block._state.expandableTitleStates'), {
          [type]: Object.assign(
            {},
            this.get('block._state.expandableTitleStates')[type],
            {
              [index]: !(
                this.get('block._state.expandableTitleStates')[type] &&
                this.get('block._state.expandableTitleStates')[type][index]
              )
            }
          )
        })
      );

      this.get('block').notifyPropertyChange('data');
    },
    checkIfDevicesIsolationIsPending: function (showCheckmark, index) {
      this.checkIfDevicesIsolationIsPending(showCheckmark, index);
    },
    changeIsolationStatus: function (newStatus, deviceIndex) {
      this.changeIsolationStatus(newStatus, deviceIndex);
    }
  },
  checkIfDevicesIsolationIsPending: function (showCheckmark, index) {
    this.set('checkIfDevicesIsolationIsPendingIsRunning', true);
    if (showCheckmark) this.set(`block._state.showRefreshCheckmark.${index}`, false);

    this.sendIntegrationMessage({
      action: 'checkIfDevicesIsolationIsPending',
      data: {
        devices: this.get('details.devices')
      }
    })
      .then(({ devicesWithPendingStatus }) => {
        this.set('details.devices', devicesWithPendingStatus);
      })
      .finally(() => {
        this.set('checkIfDevicesIsolationIsPendingIsRunning', false);
        if (showCheckmark) this.set(`block._state.showRefreshCheckmark.${index}`, true);
        this.get('block').notifyPropertyChange('data');

        setTimeout(() => {
          this.set(`block._state.showRefreshCheckmark.${index}`, false);
          this.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  },
  changeIsolationStatus: function (newStatus, deviceIndex) {
    this.set('changeIsolationStatusIsRunning', true);
    const devices = this.get('details.devices');
    this.sendIntegrationMessage({
      action: 'changeIsolationStatus',
      data: {
        newStatus,
        device: devices[deviceIndex]
      }
    })
      .then(({ deviceWithNewStatus }) => {
        this.set(`details.devices.${deviceIndex}`, deviceWithNewStatus);
      })
      .catch((err) => {
        this.set(
          `changeIsolationStatusErrorMessage.${deviceIndex}`,
          `Failed to Change Device Isolation: ${
            (err &&
              (err.detail || err.message || err.err || err.title || err.description)) ||
            'Unknown Reason'
          }`
        );
      })
      .finally(() => {
        this.set('changeIsolationStatusIsRunning', false);
        this.set(`details.devices.${deviceIndex}.statusChangeComment`, '');
        this.get('block').notifyPropertyChange('data');

        setTimeout(() => {
          this.set(`changeIsolationStatusErrorMessage.${deviceIndex}`, '');
          this.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  },
  quarantineFile: function (alertIndex, file) {
    this.set('quarantineFileIsRunning', true);
    const alerts = this.get('details.alerts');

    this.sendIntegrationMessage({
      action: 'quarantineFile',
      data: {
        alert: alerts[alertIndex],
        file
      }
    })
      .then(({ quarantineSuccessMessage }) => {
        this.set(`quarantineFileSuccessMessage.${alertIndex}`, quarantineSuccessMessage);
        this.set(`block.alerts.${alertIndex}.quarantineComment`, '');
      })
      .catch((err) => {
        this.set(
          `quarantineFileErrorMessage.${alertIndex}`,
          `Failed to Quarantine File: ${
            (err &&
              (err.detail || err.message || err.err || err.title || err.description)) ||
            'Unknown Reason'
          }`
        );
      })
      .finally(() => {
        this.set('quarantineFileIsRunning', false);
        this.get('block').notifyPropertyChange('data');

        setTimeout(() => {
          this.set(`quarantineFileErrorMessage.${alertIndex}`, '');
          this.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  }
});
