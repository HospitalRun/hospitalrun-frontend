<<<<<<< HEAD
import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import { translationMacro as t } from 'ember-i18n';
export default Ember.Controller.extend(IsUpdateDisabled, {
  patientsController: Ember.inject.controller('patients'),

  editController: Ember.computed.alias('patientsController'),
  showUpdateButton: true,
  title: t('patients.titles.familyInfo'),
  updateButtonAction: 'update',

  updateButtonText: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('buttons.add');
    } else {
      return this.get('i18n').t('buttons.update');
    }
  }.property('model.isNew'),

  actions: {
    cancel() {
      this.send('closeModal');
    },

    update() {
      let model = this.get('model');
      this.get('editController').send('updateFamilyInfo', model);
    }
  }
});
=======
import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import { translationMacro as t } from 'ember-i18n';
export default Controller.extend(IsUpdateDisabled, {
  patientsController: controller('patients'),

  editController: alias('patientsController'),
  showUpdateButton: true,
  title: t('patients.titles.familyInfo'),
  updateButtonAction: 'update',

  updateButtonText: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('buttons.add');
    } else {
      return this.get('i18n').t('buttons.update');
    }
  }.property('model.isNew'),

  actions: {
    cancel() {
      this.send('closeModal');
    },

    update() {
      let model = this.get('model');
      this.get('editController').send('updateFamilyInfo', model);
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
