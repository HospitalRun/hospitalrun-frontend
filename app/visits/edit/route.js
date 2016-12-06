import { translationMacro as t } from 'ember-i18n';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
  editTitle: t('visits.titles.editVisit'),
  modelName: 'visit',
  newTitle: t('visits.titles.newVisit'),
  pricingCategory: 'Ward',

  model(params) {
    let idParam = this.get('idParam');
    if (!Ember.isEmpty(idParam) && params[idParam] === 'checkin') {
      let newVisit = this.get('store').createRecord('visit', {
        outPatient: true,
        checkIn: true,
        startDate: new Date(),
        endDate: new Date(),
        returnToOutPatient: true
      });
      return newVisit;
    } else {
      return this._super(params);
    }
  },

  getNewData() {
    return Ember.RSVP.resolve({
      visitType: 'Admission',
      startDate: new Date(),
      status: 'Admitted'
    });
  },

  getScreenTitle(model) {
    if (model.get('checkIn')) {
      return this.get('i18n').t('visits.titles.patientCheckIn');
    } else {
      return this._super(model);
    }
  },

  actions: {
    updateNote() {
      this.controller.send('update', true);
    },
    deletePatientNote(model) {
      this.controller.send('deletePatientNote', model);
    }
  }
});
