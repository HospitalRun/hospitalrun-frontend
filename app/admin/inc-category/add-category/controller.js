import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',

  editController: Ember.inject.controller('inc-category'),

  newCategory: false,

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Category';
    }
    return 'Edit Category';
  }.property('model.isNew'),

  updateCapability: 'add_category',

  beforeUpdate: function() {
    if (this.get('model.isNew')) {
      this.set('newCategory', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(newCategory) {
    if (this.get('newCategory')) {
      this.get('editController').send('addCategory', newCategory);
    } else {
      this.send('closeModal');
    }
  }
});
