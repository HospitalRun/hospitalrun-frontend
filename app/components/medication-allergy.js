import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  classNames: 'ps-info-group long-form',

  canAddAllergy: null,
  patient: null,
  editAllergyAction: 'editAllergy',
  showAddAllergyAction: 'showAddAllergy',

  showAllergies: computed('canAddAllergy', 'patient.allergies.[]', {
    get() {
      let canAddAllergy = get(this, 'canAddAllergy');
      let patientAllergies = get(this, 'patient.allergies');
      return canAddAllergy || !isEmpty(patientAllergies);
    }
  }),

  actions: {
    editAllergy(allergy) {
      this.sendAction('editAllergyAction', allergy);
    },

    createNewAllergy() {
      this.sendAction('showAddAllergyAction');
    }
  }
});
