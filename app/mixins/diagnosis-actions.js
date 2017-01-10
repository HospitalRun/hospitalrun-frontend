import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({
  canAddDiagnosis: computed(function() {
    return this.currentUserCan('add_diagnosis');
  }),

  editDiagnosis(diagnosis) {
    diagnosis.set('editController', this);
    this.send('openModal', 'diagnosis.edit', diagnosis);
  },

  actions: {
    deleteDiagnosis(diagnosis) {
      let diagnoses = this.get('model.diagnoses');
      diagnoses.removeObject(diagnosis);
      diagnosis.set('archived', true);
      diagnosis.save().then(() => {
        this.send('closeModal');
        this.send('update', true);
      });
    },

    editDiagnosis(diagnosis) {
      this.editDiagnosis(diagnosis);
    },

    showAddDiagnosis() {
      let newDiagnosis = this.get('store').createRecord('diagnosis', {
        date: new Date()
      });
      this.editDiagnosis(newDiagnosis);
    }
  }

});
