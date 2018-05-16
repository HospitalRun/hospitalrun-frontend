<<<<<<< HEAD
import Ember from 'ember';

const { computed } = Ember;

export const COMPLETED_STATUS = 'completed';
export const DROPPED_STATUS = 'dropped';
export const PLANNED_STATUS = 'planned';

const STATUS_VALUES = [
  COMPLETED_STATUS,
  DROPPED_STATUS,
  PLANNED_STATUS
];

export default Ember.Mixin.create({
  planStatuses: computed(function() {
    let i18n = this.get('i18n');

    return STATUS_VALUES.map((status) => {
      return {
        id: status,
        value: i18n.t(`operativePlan.labels.${status}Status`)
      };
    }).sort(function(a, b) {
      return Ember.compare(a.value.toString(), b.value.toString());
    });
  })
});
=======
import { compare } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export const COMPLETED_STATUS = 'completed';
export const DROPPED_STATUS = 'dropped';
export const PLANNED_STATUS = 'planned';

const STATUS_VALUES = [
  COMPLETED_STATUS,
  DROPPED_STATUS,
  PLANNED_STATUS
];

export default Mixin.create({
  planStatuses: computed(function() {
    let i18n = this.get('i18n');

    return STATUS_VALUES.map((status) => {
      return {
        id: status,
        value: i18n.t(`operativePlan.labels.${status}Status`)
      };
    }).sort(function(a, b) {
      return compare(a.value.toString(), b.value.toString());
    });
  })
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
