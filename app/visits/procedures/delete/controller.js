<<<<<<< HEAD
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyProcedureDelete',
  editController: Ember.inject.controller('visits/edit'),
  title: 'Delete Procedure',

  actions: {
    notifyProcedureDelete() {
      this.send('closeModal');
      this.get('editController').send('deleteProcedure', this.get('model'));
    }
  }
});
=======
import { inject as controller } from '@ember/controller';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyProcedureDelete',
  editController: controller('visits/edit'),
  title: 'Delete Procedure',

  actions: {
    notifyProcedureDelete() {
      this.send('closeModal');
      this.get('editController').send('deleteProcedure', this.get('model'));
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
