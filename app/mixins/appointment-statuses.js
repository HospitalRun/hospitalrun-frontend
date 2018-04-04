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
