import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

const {
  computed,
  isEmpty
} = Ember;

export default AbstractEditController.extend({
  updateAction: 'addForm',

  actions: {
    addForm() {
      let modelToAddTo = this.get('model.modelToAddTo');
      let modelCustomForms = modelToAddTo.get('customForms');
      let selectedForm = this.get('model.selectedForm');
      if (isEmpty(modelCustomForms)) {
        modelCustomForms = Ember.Object.create();
        modelToAddTo.set('customForms', modelCustomForms);
      }
      modelCustomForms.set(selectedForm, Ember.Object.create());
      modelToAddTo.notifyPropertyChange('customForms');
      this.send('closeModal');
    }
  },

  isUpdateDisabled: computed('model.selectedForm', function() {
    return isEmpty(this.get('model.selectedForm'));
  })

});
