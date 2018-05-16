<<<<<<< HEAD
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  appointmentStatusList: [
    'Attended',
    'Scheduled',
    'Canceled',
    'Missed'
  ],
  appointmentStatuses: Ember.computed.map('appointmentStatusList', SelectValues.selectValuesMap),

  appointmentStatusesWithEmpty: function() {
    return SelectValues.selectValues(this.get('appointmentStatusList'), true);
  }.property()
});
=======
import { map } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import SelectValues from 'hospitalrun/utils/select-values';
export default Mixin.create({
  appointmentStatusList: [
    'Attended',
    'Scheduled',
    'Canceled',
    'Missed'
  ],
  appointmentStatuses: map('appointmentStatusList', SelectValues.selectValuesMap),

  appointmentStatusesWithEmpty: function() {
    return SelectValues.selectValues(this.get('appointmentStatusList'), true);
  }.property()
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
