import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyProcedureDelete',
  editController: Ember.inject.controller('visits/edit'),
  title: 'Delete Procedure',

  actions: {
    notifyProcedureDelete: function() {
      this.send('closeModal');
      this.get('editController').send('deleteProcedure', this.get('model'));
    }
  }
});
