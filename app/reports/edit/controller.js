import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import DS from 'ember-data';

export default AbstractEditController.extend(PatientSubmodule, PatientDiagnosis, PouchDbMixin, {
  visitsController: Ember.inject.controller('visits'),

  lookupListsToUpdate: [],

  newReport: false,

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('reports.titles.add');
    }
    return this.get('i18n').t('reports.titles.edit');
  }.property('model.isNew'),

  diagnosis: Ember.computed ('model.patient',function() {
    let container = this.get('model.patient');
      let result = {
        primary: this.getDiagnoses(container, true, false),
        secondary: this.getDiagnoses(container, true, true)
      };
    return result;
  }),

  nextAppointment: Ember.computed('model.patient.id', 'model.visit.startDate', function () {
    let patientId = this.get('model.patient.id')
    let visitDate = this.get('model.visit.startDate')
    let maxValue = this.get('maxValue');
    let promise =  this.store.query('appointment', {
      options: {
        startkey: [patientId, null, null, 'appointment_'],
        endkey: [patientId, maxValue, maxValue, maxValue]
      },
      mapReduce: 'appointments_by_patient'
    }).then(function(result) {
      let futureAppointments = result.filter(function (data) {
        let startDate =  data.get('startDate')
        return startDate && moment(startDate).isAfter(moment(visitDate), 'day')
      }).sortBy('startDate')
      if (!futureAppointments.length) {
        return ''
      }
      let appointment = futureAppointments[0];
      let res = appointment.get('startDate');
      return res;
    });
    return DS.PromiseObject.create({ promise: promise });
  }),

  updateCapability: 'add_report',

  beforeUpdate() {
    debugger
    return new Ember.RSVP.Promise(function(resolve) {
        if (this.get('model.isNew')) {
           var appointmentDate = this.get('nextAppointment').get('content')
           this.get('model').set('nextAppointment', appointmentDate)
          if (this.get('model.visit.outPatient')) {
              this.get('model').set('reportType', 'OutPatient')
          } else {
              this.get('model').set('reportType', 'Discharge')
          }
        }
          resolve();
    }.bind(this));
  },

  afterUpdate() {
    let alertTitle = this.get('i18n').t('reports.titles.saved');
    let alertMessage = this.get('i18n').t('reports.messages.saved');
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  }
});
