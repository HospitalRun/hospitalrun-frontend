import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
import moment from 'moment';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(AddToPatientRoute, ChargeRoute, PatientListRoute, {
  editTitle: t('labs.editTitle'),
  modelName: 'lab',
  newTitle: t('labs.newTitle'),
  pricingCategory: 'Lab',
  customForms: Ember.inject.service(),

  actions: {
    returnToAllItems() {
      this.controller.send('returnToAllItems');
    }
  },

  getNewData() {
    let newLabData = {
      selectPatient: true,
      requestDate: moment().startOf('day').toDate(),
      customForms: Ember.Object.create()
    };
    let customForms = this.get('customForms');
    return customForms.setDefaultCustomForms(['lab'], newLabData);
  }
});
