import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
  actions: {
    cancel: function() {
      this.send('closeModal');
    }
  },

  afterUpdate: function(record) {
    let message = `The pricing profile ${record.get('name')} has been saved.`;
    this.displayAlert('Pricing Profile Saved', message, 'refreshProfiles');
  },

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return 'New Pricing Profile';
    } else {
      return 'Edit Pricing Profile';
    }
  }.property('model.isNew')
});
