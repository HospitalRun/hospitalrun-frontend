import EmberObject, { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  updateAction: 'addForm',

  actions: {
    addForm() {
      let modelToAddTo = this.get('model.modelToAddTo');
      let modelCustomForms = modelToAddTo.get('customForms');
      let selectedForm = this.get('model.selectedForm');
      if (isEmpty(modelCustomForms)) {
        modelCustomForms = EmberObject.create();
        modelToAddTo.set('customForms', modelCustomForms);
      }
      modelCustomForms.set(selectedForm, EmberObject.create());
      modelToAddTo.notifyPropertyChange('customForms');
      this.send('closeModal');
    }
  },

  isUpdateDisabled: computed('model.selectedForm', function() {
    return isEmpty(this.get('model.selectedForm'));
  })

});
