import Mixin from '@ember/object/mixin';

export default Mixin.create({
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
        this.silentUpdate('closeModal');
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
