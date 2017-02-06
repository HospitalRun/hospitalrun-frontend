import { translationMacro as t } from 'ember-i18n';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';

export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
  customForms: Ember.inject.service(),
  editTitle: t('visits.titles.editVisit'),
  modelName: 'visit',
  newTitle: t('visits.titles.newVisit'),
  pricingCategory: 'Ward',

  model(params) {
    let idParam = this.get('idParam');
    if (!Ember.isEmpty(idParam) && params[idParam] === 'checkin') {
      return this.getNewData().then((newData) => {
        newData.checkIn = true;
        let newVisit = this.get('store').createRecord('visit', newData);
        return newVisit;
      });
    } else {
      return this._super(params);
    }
  },

  getNewData() {
    let newVisitData = {
      startDate: new Date(),
      visitType: 'Admission',
      customForms: Ember.Object.create()
    };
    let customForms = this.get('customForms');
    return customForms.setDefaultCustomForms(['visit'], newVisitData);
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
