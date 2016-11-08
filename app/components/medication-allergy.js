import Ember from 'ember';
import {translationMacro as t} from 'ember-i18n';

const { getOwner } = Ember;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  medicationInteraction: Ember.inject.service(),
  patient: null,
  currentPath: null,
  displayModal: false,
  title: "add allergy",
  updateButtonText: 'add',
  updateButtonAction: 'addAllergy',
  showUpdateButton: true,
  showOperations: false,

  init() {
    let path = getOwner(this).lookup('controller:application').currentPath;
    this.set('currentPath', path);
    this._super(...arguments);
  },

  actions: {
    openModal() {
      this.set('displayModal', true);
    },
    closeModal() {
      this.set('displayModal', false);
    },
    showAddAllergy() {
      this.send('openModal', this.get('currentPath'), {});
    },

    showEditAllergy(allergy) {
      this.send('openModal', 'patients.allergy', allergy);
    },

    deleteAllergy(allergy) {
      let model = this.get('patient');
      model.get('allergies').removeObject(allergy);
      allergy.destroyRecord();
      model.save().then(() => {
        this.send('closeModal');
      });
    },

    addAllergy() {
      let allergy = this.getProperties('name', 'reaction', 'icd9CMCode', 'icd10Code');
      let model = this.get('patient');
      allergy.patient = model;
      let allergy_record = this.get('store').createRecord('allergy', allergy);
      model.get('allergies').pushObject(allergy_record);
      allergy_record.save();
      model.save().then(() => {
        this.set('displayModal', false);
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
