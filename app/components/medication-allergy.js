import Ember from 'ember';
import {translationMacro as t} from 'ember-i18n';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  patient: null,
  displayModal: false,
  title: "add allergy",
  updateButtonText: 'add',
  updateButtonAction: 'closeAllergyModal',
  showUpdateButton: true,
  allergyProps: ['name', 'icd9CMCode', 'icd10Code'],
  buttonConfirmText: "Ok",
  addAllergyRow: false,
  init() {
    this._super(...arguments);
  },

  actions: {
    showAllAllergies() {
      this.set('displayModal', true);
    },

    closeModal() {},

    closeAllergyModal() {
      this.set('displayModal', false);
    },

    toggleAddAllergy() {
      this.set('addAllergyRow', true)
    },

    addAllergy() {
      let model = this.get('patient');
      let allergy_record = this.get('store').createRecord('allergy', {
        name: this.get('name'),
        icd9CMCode: this.get('icd9CMCode'),
        icd10Code: this.get('icd10Code')
      });
      model.get('allergies').pushObject(allergy_record);
      allergy_record.save();
      model.save().then(() => {
        this.set('name', '');
        this.set('icd9CMCode', '');
        this.set('icd10Code', '');
        this.set('addAllergyRow', false);
      });

    },

    /**
     * Note: the allergy model is passed in here, so we can get all the data in the future
     * @param allergyModel
     */
    checkAllergyInteraction(allergyModel) {
      let allergyName = allergyModel.get('name');
      this.get('medicationInteraction').findPossibleAllergies(allergyName)
        .then(results => {
        console.log(results);
      })
        .catch(err => {
          console.log(err);
        })
    }
  }

});
