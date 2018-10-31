import { inject as service } from '@ember/service';
import EmberObject, { get } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import moment from 'moment';
import { translationMacro as t } from 'ember-intl';

export default AbstractEditRoute.extend(AddToPatientRoute, {
  editTitle: t('operativePlan.titles.editTitle'),
  modelName: 'operative-plan',
  newTitle: t('operativePlan.titles.newTitle'),

  customForms: service(),
  database: service(),

  getNewData() {
    let customForms = get(this, 'customForms');
    let newData = {
      customForms: EmberObject.create()
    };
    return customForms.setDefaultCustomForms(['operativePlan'], newData);
  },

  setupController(controller, model) {
    this._super(controller, model);
    let database = get(this, 'database');
    let maxApptId = database.getMaxPouchId('appointment');
    let minApptId = database.getMinPouchId('appointment');
    let patientId = get(model, 'patient.id');
    let startDate = moment().toDate().getTime();
    let endDate = moment().add(10, 'years').toDate().getTime();

    this.store.query('appointment', {
      options: {
        startkey: [patientId, startDate, startDate, minApptId],
        endkey: [patientId, endDate, endDate, maxApptId]
      },
      mapReduce: 'appointments_by_patient'
    }).then(function(appointments) {
      model.set('appointments', appointments);
    });
  },

  actions: {
    showOperationReport(report) {
      this.transitionTo('patients.operation-report', report);
    }
  }
});
