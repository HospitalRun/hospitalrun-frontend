import Ember from 'ember';
export default Ember.Controller.extend({
  incidentCategoryEdit: Ember.inject.controller('inc-category'),
  editController: Ember.computed.alias('incidentCategoryEdit'),
  title: 'Add Item',
  updateButtonText: 'Add',
  updateButtonAction: 'add',
  showUpdateButton: true,

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    add: function() {
      var newItem = this.getProperties('item');
      this.get('editController').send('addItem', newItem);
    }
  }
});
