import Ember from "ember";
import TabRoute from "ember-inspector/routes/tab";

const set = Ember.set;

export default TabRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);

    const type = this.modelFor('model_type');

    controller.set('modelType', type);

    this.get('port').on('data:recordsAdded', this, this.addRecords);
    this.get('port').on('data:recordsUpdated', this, this.updateRecords);
    this.get('port').on('data:recordsRemoved', this, this.removeRecords);
    this.get('port').one('data:filters', this, function(message) {
      this.set('controller.filters', message.filters);
    });
    this.get('port').send('data:getFilters');
    this.get('port').send('data:getRecords', { objectId: type.objectId });
  },

  model() {
    return [];
  },

  deactivate() {
    this.get('port').off('data:recordsAdded', this, this.addRecords);
    this.get('port').off('data:recordsUpdated', this, this.updateRecords);
    this.get('port').off('data:recordsRemoved', this, this.removeRecords);
    this.get('port').send('data:releaseRecords');
  },

  updateRecords(message) {
    message.records.forEach(record => {
      let currentRecord = this.get('currentModel').findBy('objectId', record.objectId);
      if (currentRecord) {
        set(currentRecord, 'columnValues', record.columnValues);
        set(currentRecord, 'filterValues', record.filterValues);
        set(currentRecord, 'searchIndex', record.searchIndex);
        set(currentRecord, 'color', record.color);
      }
    });

  },

  addRecords(message) {
    this.get('currentModel').pushObjects(message.records);
  },

  removeRecords(message) {
    this.get('currentModel').removeAt(message.index, message.count);
  }
});
