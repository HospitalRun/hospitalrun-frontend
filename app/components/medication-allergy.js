import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  patient: null,
  displayModal: false,
  currentAllergy: false,
  showAllAllergies: false,
  buttonConfirmText: t('buttons.update'),
  modalTitle: Ember.computed('currentAllergy', function() {
    let allergy = this.get('currentAllergy');

    if (allergy) {
      return t('allergies.editAllergy');
    } else {
      return t('allergies.addAllergy');
    }
  }),

  additionalButtons: Ember.computed('currentAllergy', function() {
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
        model.get('allergies').pushObject(allergyModel);
        model.save().then(() => {
          this.set('name', '');
          this.closeAllergyModal();
        });
      } else {
        allergyModel.save().then(() => {
          this.closeAllergyModal();
        });
      }
    },
    deleteAllergy() {
      let allergy = this.get('currentAllergy');
      allergy.destroyRecord().then(() => {
        this.closeAllergyModal();
      });
    }
  }
});
