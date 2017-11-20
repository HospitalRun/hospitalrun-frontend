import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';

export default Mixin.create({
  openAllergyModal(allergy) {
    set(allergy, 'editController', this);
    this.send('openModal', 'allergy.edit', allergy);
  },

  savePatientAllergy(patient, allergy) {
    get(patient, 'allergies').pushObject(allergy);
    patient.save().then(() => {
      this.silentUpdate('closeModal');
    });
  },

  deletePatientAllergy(patient, allergy) {
    let patientAllergies = get(patient, 'allergies');
    allergy.destroyRecord().then(() => {
      patientAllergies.removeObject(allergy);
      patient.save().then(() => {
        this.send('closeModal');
      });
    });
  },

  actions: {
    editAllergy(allergy) {
      this.openAllergyModal(allergy);
    },

    showAddAllergy() {
      let newAllergy = get(this, 'store').createRecord('allergy');
      this.openAllergyModal(newAllergy);
    }
  }
});
