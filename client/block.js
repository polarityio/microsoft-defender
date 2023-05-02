polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  activeTab: '',
  expandableTitleStates: {
    kustoQueryResults: { 0: true }
  },
  displayTabNames: {
    incidents: 'Incidents',
    alerts: 'Alerts',
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
        : 'kustoQueryResults'
    );

    this._super(...arguments);
  },
  actions: {
    changeTab: function (tabName) {
      this.set('activeTab', tabName);
    },
    toggleExpandableTitle: function (index, type) {
      this.set(
        `expandableTitleStates`,
        Object.assign({}, this.get('expandableTitleStates'), {
          [type]: Object.assign({}, this.get('expandableTitleStates')[type], {
            [index]: !(
              this.get('expandableTitleStates')[type] &&
              this.get('expandableTitleStates')[type][index]
            )
          })
        })
      );

      this.get('block').notifyPropertyChange('data');
    }
  }
});
