import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import GenderList from 'hospitalrun/mixins/gender-list';
export default AbstractEditController.extend(GenderList, {
  title: 'New Patient',

  updateCapability: 'add_patient',

  actions: {
    cancel: function() {
      this.send('closeModal');
    }
  },

  afterUpdate: function(record) {
    var requestingController = this.get('requestingController');
    requestingController.send('addedNewPatient', record);
  }
});
