<<<<<<< HEAD
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
=======
import Controller, { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { get } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';

export default Controller.extend({
  showUpdateButton: true,
  title: t('incident.titles.addCategoryItem'),
  updateButtonAction: 'add',
  updateButtonText: 'Add',

  incidentCategoryEdit: controller('inc-category/edit'),
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
