import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
export default Ember.Controller.extend(IsUpdateDisabled, {
  editController: Ember.inject.controller('admin/lookup'),
  showUpdateButton: true,

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return t('admin.lookup.edit.controller.add_title');
    } else {
      return t('admin.lookup.edit.controller.edit_title');
    }
  }.property('model.isNew'),

  updateButtonAction: 'update',

  updateButtonText: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return t('admin.lookup.edit.controller.update_button_text_add');
    } else {
      return t('admin.lookup.edit.controller.update_button_text_update');
    }
  }.property('model.isNew'),

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
