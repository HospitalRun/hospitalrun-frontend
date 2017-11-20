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
