import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import { computed } from '@ember/object';

export default AbstractDeleteController.extend({
  title: 'Delete Visit',

  afterDeleteAction: computed('model.deleteFromPatient', function() {
    let deleteFromPatient = this.get('model.deleteFromPatient');
    if (deleteFromPatient) {
      return 'visitDeleted';
    } else {
      return 'closeModal';
    }
  })
});
