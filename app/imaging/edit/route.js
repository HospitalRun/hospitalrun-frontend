import { translationMacro as t } from 'ember-i18n';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
import moment from 'moment';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(AddToPatientRoute, ChargeRoute, PatientListRoute, {
  editTitle: t('imaging.titles.editTitle'),
  modelName: 'imaging',
  newTitle: t('imaging.titles.editTitle'),
  pricingCategory: 'Imaging',

  actions: {
    returnToAllItems() {
      this.controller.send('returnToAllItems');
    }
  },

  getNewData() {
    return Ember.RSVP.resolve({
      selectPatient: true,
      requestDate: moment().startOf('day').toDate()
    });
  }
});
