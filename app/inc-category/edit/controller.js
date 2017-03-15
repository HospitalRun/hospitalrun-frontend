import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

const { get } = Ember;

export default AbstractEditController.extend({
  updateCapability: 'add_incident_category',

  afterUpdate(record) {
    let i18n = get(this, 'i18n');
    let message = i18n.t('incident.messages.incidentCategorySaved', { name: get(record, 'incidentCategoryName') });
    let title = i18n.t('incident.titles.incidentCategorySaved');
    this.displayAlert(title, message);
  },

  actions: {
    addItem(newItem) {
      let categoryItems = this.getWithDefault('model.incidentCategoryItems', []);
      let model = get(this, 'model');
      categoryItems.addObject(newItem);
      model.set('incidentCategoryItems', categoryItems);
      this.send('update', true);
      this.send('closeModal');
    },

    deleteItem(model) {
      let item = model.get('itemToDelete');
      let categoryItems = get(this, 'model.incidentCategoryItems');
      categoryItems.removeObject(item);
      this.send('update', true);
    },

    showAddItem() {
      this.send('openModal', 'inc-category.add-item', Ember.Object.create());
    },

    showDeleteItem(item) {
      let i18n = get(this, 'i18n');
      let message = i18n.t('incident.messages.deleteItem');
      let title = i18n.t('incident.titles.deleteItem');
      this.displayConfirm(title, message, 'deleteItem', Ember.Object.create({
        itemToDelete: item
      }));
    }
  }

});
