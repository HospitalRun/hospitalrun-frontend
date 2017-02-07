import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({
  updateCapability: 'add_incident_category',
  actions: {

    addItem(newItem) {
      let categoryItems = this.getWithDefault('model.incidentCategoryItems', []);
      let model = this.get('model');
      categoryItems.addObject(newItem);
      model.set('incidentCategoryItems', categoryItems);
      this.send('update', true);
      this.send('closeModal');
    },

    deleteItem(model) {
      let item = model.get('itemToDelete');
      let categoryItems = this.get('model.incidentCategoryItems');
      categoryItems.removeObject(item);
      this.send('update', true);
    },

    showAddItem() {
      this.send('openModal', 'inc-category.add-item', {});
    },

    showDeleteItem(item) {
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

  afterUpdate(record) {
    let message = `The category record for ${record.get('incidentCategoryName')} has been saved.`;
    this.displayAlert('Incident Category Saved', message);
  }
});
