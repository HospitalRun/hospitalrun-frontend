import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({

  actions: {

    addItem: function(newItem) {
      var categoryItems = this.getWithDefault('model.incidentCategoryItems', []),
          model = this.get('model');
      categoryItems.addObject(newItem);
      model.set('incidentCategoryItems', categoryItems);
      this.send('update', true);
      this.send('closeModal');
    },

    deleteItem: function(model) {
      var item = model.get('itemToDelete');
      var categoryItems = this.get('model.incidentCategoryItems');
      categoryItems.removeObject(item);
      this.send('update', true);
    },

    showAddItem: function() {
      this.send('openModal', 'inc-category.add-item', {});
    },

    showDeleteItem: function(item) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteItem',
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        itemToDelete: item,
        updateButtonAction: 'confirm',
        updateButtonText: 'Ok'
      }));
    }
  },

  afterUpdate: function(record) {
    var message = `The category record for ${record.get('incidentCategoryName')} has been saved.`;
    this.displayAlert('Incident Category Saved', message);
  }
});
