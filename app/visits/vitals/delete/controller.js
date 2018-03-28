import { inject as controller } from '@ember/controller';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyVitalsDelete',
  editController: controller('visits/edit'),
  title: 'Delete Vitals',

  actions: {
    notifyVitalsDelete() {
      this.send('closeModal');
      this.get('editController').send('deleteVitals', this.get('model'));
    }
  }
});
