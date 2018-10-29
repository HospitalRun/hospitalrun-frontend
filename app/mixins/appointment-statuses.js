import { map } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import SelectValues from 'hospitalrun/utils/select-values';
import { computed } from '@ember/object';

export default Mixin.create({
  appointmentStatusList: [
    'Attended',
    'Scheduled',
    'Canceled',
    'Missed'
  ],
  appointmentStatuses: map('appointmentStatusList', SelectValues.selectValuesMap),

  appointmentStatusesWithEmpty: computed(function() {
    return SelectValues.selectValues(this.get('appointmentStatusList'), true);
  })
});
