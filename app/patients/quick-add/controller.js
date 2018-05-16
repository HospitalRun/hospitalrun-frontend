<<<<<<< HEAD
import Ember from 'ember';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditController.extend({
  sexList: Ember.computed.alias('model.requestingController.sexList'),
  title: t('patients.titles.new'),

  updateCapability: 'add_patient',

  actions: {
    cancel() {
      this.send('closeModal');
    }
  },

  afterUpdate(record) {
    let requestingController = this.get('model.requestingController');
    requestingController.send('addedNewPatient', record);
  }
});
=======
import { alias } from '@ember/object/computed';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditController.extend({
  sexList: alias('model.requestingController.sexList'),
  title: t('patients.titles.new'),

  updateCapability: 'add_patient',

  actions: {
    cancel() {
      this.send('closeModal');
    }
  },

  afterUpdate(record) {
    let requestingController = this.get('model.requestingController');
    requestingController.send('addedNewPatient', record);
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
