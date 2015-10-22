import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  appointmentStatusList: [
    'Scheduled',
    'Canceled'
  ],
  appointmentStatuses: Ember.computed.map('appointmentStatusList', SelectValues.selectValuesMap),

  appointmentStatusesWithEmpty: function() {
    return SelectValues.selectValues(this.get('appointmentStatusList'), true);
  }.property()
});
