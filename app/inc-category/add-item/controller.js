import Ember from 'ember';
export default Ember.Controller.extend({
  incidentCategoryEdit: Ember.inject.controller('inc-category/edit'),
  editController: Ember.computed.alias('incidentCategoryEdit'),
  title: 'Add Item',
  updateButtonText: 'Add',
  updateButtonAction: 'add',
  showUpdateButton: true,

  actions: {
    cancel() {
      this.send('closeModal');
    },

    add() {
      let newItem = this.getProperties('item');
      this.get('editController').send('addItem', newItem);
    }
  }
});
