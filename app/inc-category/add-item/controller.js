import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const {
  Controller,
  computed: {
    alias
  },
  get,
  inject
} = Ember;

export default Controller.extend({
  showUpdateButton: true,
  title: t('incident.titles.addCategoryItem'),
  updateButtonAction: 'add',
  updateButtonText: 'Add',

  incidentCategoryEdit: inject.controller('inc-category/edit'),
  editController: alias('incidentCategoryEdit'),

  actions: {
    add() {
      let newItem = get(this, 'model');
      get(this, 'editController').send('addItem', newItem);
    },

    cancel() {
      this.send('closeModal');
    }
  }
});
