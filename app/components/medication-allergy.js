import Ember from 'ember';
import {translationMacro as t} from 'ember-i18n';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  patient: null,
  displayModal: false,
  allergyProps: ['name', 'icd9CMCode', 'icd10Code'],
  currentAllergy: false,
  showAllAllergies: false,
  init() {
    this._super(...arguments);
  },

  buttonConfirmText: Ember.computed(function () {
    return "Ok";
  }),

  additionalButtons: Ember.computed('currentAllergy', function () {
    let currentAllergy = this.get('currentAllergy');
    let i18n = this.get('i18n');
    if (currentAllergy) {
      return [{
        class: 'btn btn-default warning',
        buttonAction: 'deleteAllergy',
        buttonIcon: 'octicon octicon-x',
        buttonText: i18n.t('buttons.delete')
      }];
    }
  }),
  closeAllergyModal() {
    this.set('currentAllergy', false);
    this.set('displayModal', false);
  },

  actions: {
    toggleAllergyDisplay() {
      this.toggleProperty('showAllAllergies');
    },

    closeModal() {
      this.closeAllergyModal();
    },

    editAllergy(allergy) {
      this.set('currentAllergy', allergy);
      this.set('displayModal', true);
    },

    createNewAllergy() {
      this.set('displayModal', true);
    },

    updateAllergy() {
      let model = this.get('patient');
      let allergyModel = this.get('currentAllergy');
      if (!allergyModel) {
        console.log(this.get('name'));
        allergyModel = this.get('store').createRecord('allergy', {
          name: this.get('name')
        });
        model.get('allergies').pushObject(allergyModel);
        model.save().then(() => {
          this.set('name', '');
          this.closeAllergyModal();
        })
      } else {
        allergyModel.save().then(() => {
          this.closeAllergyModal();
        });
      }
    },
  }
});
