import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({
  medicationController: Ember.inject.controller('medication'),
  sexList: Ember.computed.alias('medicationController.sexList'),
  title: 'New Patient',

  updateCapability: 'add_patient',

  actions: {
    cancel: function() {
      this.send('closeModal');
    }
  },

  afterUpdate: function(record) {
    var requestingController = this.get('model.requestingController');
    requestingController.send('addedNewPatient', record);
  }
});
