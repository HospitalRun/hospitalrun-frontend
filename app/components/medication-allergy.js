import Ember from 'ember';

const {
  computed,
  get,
  isEmpty
} = Ember;

export default Ember.Component.extend({
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
