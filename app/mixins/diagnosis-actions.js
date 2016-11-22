import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({
  canAddDiagnosis: computed(function() {
    return this.currentUserCan('add_diagnosis');
  }),

  actions: {
    deleteDiagnosis(diagnosis) {
      let diagnoses = this.get('model.diagnoses');
      diagnoses.removeObject(diagnosis);
      this.send('update', true);
    },

    showAddDiagnosis() {
      let newDiagnosis = this.get('store').createRecord('diagnosis', {
        date: new Date(),
        editController: this
      });
      this.send('openModal', 'diagnosis.edit', newDiagnosis);
    }
  }

});
