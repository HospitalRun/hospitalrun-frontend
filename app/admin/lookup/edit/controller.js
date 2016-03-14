import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
export default Ember.Controller.extend(IsUpdateDisabled, {
  editController: Ember.inject.controller('admin/lookup'),
  showUpdateButton: true,

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('admin.lookup.edit.controller.add_title');
    } else {
      return this.get('i18n').t('admin.lookup.edit.controller.edit_title');
    }
  }.property('i18n.locale', 'model.isNew'),

  updateButtonAction: 'update',

  updateButtonText: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('admin.lookup.edit.controller.update_button_text_add');
    } else {
      return this.get('i18n').t('admin.lookup.edit.controller.update_button_text_update');
    }
  }.property('i18n.locale', 'model.isNew'),

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    update: function() {
      if (!Ember.isEmpty(this.get('model.value'))) {
        this.get('editController').send('updateValue', this.get('model'));
        this.send('closeModal');
      }
    }
  }
});
