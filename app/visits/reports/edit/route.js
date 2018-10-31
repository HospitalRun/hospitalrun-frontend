import { inject as service } from '@ember/service';
import EmberObject, { set, get } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import { translationMacro as t } from 'ember-intl';
import PatientVisits from 'hospitalrun/mixins/patient-visits';

export default AbstractEditRoute.extend(AddToPatientRoute, PatientVisits, {
  modelName: 'report',
  customForms: service(),

  getNewData() {
    let newReportData = {
      reportDate: new Date(),
      customForms: EmberObject.create()
    };
    let customForms = get(this, 'customForms');
    return customForms.setDefaultCustomForms(['opdReport', 'dischargeReport'], newReportData);
  },

  getScreenTitle(model) {
    let isNew = get(model, 'isNew');
    let title = null;
    if (get(model, 'visit.outPatient')) {
      title = isNew ? 'newOPDReport' : 'opdReport';
    } else {
      title = isNew ? 'newDischargeReport' : 'dischargeReport';
    }
    return t(`reports.titles.${title}`);
  },

  getDiagnosisContainer(visit) {
    if (get(visit, 'outPatient')) {
      return visit;
    }
    return null;
  },

  getCurrentOperativePlan(patient) {
    let operativePlans = get(patient, 'operativePlans');
    return operativePlans.findBy('isPlanned', true);
  },

  afterModel(model) {
    if (!get(model, 'isNew')) {
      let patient = get(model, 'visit.patient');
      set(model, 'patient', patient);
    }
    if (!get(model, 'visit')) {
      return this.transitionTo('patients');
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    let visit = get(model, 'visit');
    let patient = get(model, 'patient');
    let isOutPatient = get(visit, 'outPatient');
    set(controller, 'visit', visit);
    set(controller, 'isOutPatient', isOutPatient);
    set(controller, 'diagnosisContainer', this.getDiagnosisContainer(visit));
    set(controller, 'currentOperativePlan', this.getCurrentOperativePlan(patient));
    if (isOutPatient) {
      set(controller, 'nextAppointments', this.getPatientFutureAppointment(visit, true));
    } else {
      set(controller, 'nextAppointment', this.getPatientFutureAppointment(visit));
    }
  }
});
