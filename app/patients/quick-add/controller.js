import Ember from 'ember';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditController.extend({
  medicationController: Ember.inject.controller('medication'),
  sexList: Ember.computed.alias('medicationController.sexList'),
  title: t('patients.titles.new'),

  updateCapability: 'add_patient',

  actions: {
    cancel: function() {
      this.send('closeModal');
    }
  },

  afterUpdate: function(record) {
    let requestingController = this.get('model.requestingController');
    requestingController.send('addedNewPatient', record);
  }
});
