import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: 'ps-info-group long-form',
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  patient: null,
  displayModal: false,
  currentAllergy: false,

  buttonConfirmText: computed('currentAllergy', function() {
    let i18n = this.get('i18n');
    let currentAllergy = this.get('currentAllergy');
    if (currentAllergy) {
      return i18n.t('buttons.update');
    } else {
      return i18n.t('buttons.add');
    }
  }),

  additionalButtons: computed('currentAllergy', function() {
    let currentAllergy = this.get('currentAllergy');
    let btn = this.get('i18n').t('buttons.delete');
    if (currentAllergy) {
      return [{
        class: 'btn btn-default warning',
        buttonAction: 'deleteAllergy',
        buttonIcon: 'octicon octicon-x',
        buttonText: btn
      }];
    }
  }),

  modalTitle: Ember.computed('currentAllergy', function() {
    let currentAllergy = this.get('currentAllergy');
    let i18n = this.get('i18n');
    if (currentAllergy) {
      return i18n.t('allergies.titles.editAllergy');
    } else {
      return i18n.t('allergies.titles.addAllergy');
    }
  }),

  closeAllergyModal() {
    this.set('currentAllergy', false);
    this.set('displayModal', false);
  },

  actions: {

    cancel() {
      this.closeAllergyModal();
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
        allergyModel = this.get('store').createRecord('allergy', {
          name: this.get('name')
        });
        allergyModel.save().then(() => {
          model.get('allergies').pushObject(allergyModel);
          model.save().then(() => {
            this.set('name', '');
            this.closeAllergyModal();
          });
        });
      } else {
        allergyModel.save().then(() => {
          this.closeAllergyModal();
        });
      }
    },
    deleteAllergy() {
      let allergy = this.get('currentAllergy');
      let patient = this.get('patient');
      let patientAllergies = patient.get('allergies');
      allergy.destroyRecord().then(() => {
        patientAllergies.removeObject(allergy);
        patient.save().then(() => {
          this.closeAllergyModal();
        });
      });
    }
  }
});
