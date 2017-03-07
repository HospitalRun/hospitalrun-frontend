import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import DS from 'ember-data';
import moment from 'moment';

export default AbstractEditController.extend(PatientSubmodule, PatientDiagnosis, PouchDbMixin, {
  lookupListsToUpdate: [],

  newReport: false,

  diagnosis: Ember.computed('model.patient', function() {
    let container = this.get('model.patient');
    let result = {
      primary: this.getDiagnoses(container, true, false),
      secondary: this.getDiagnoses(container, true, true)
    };
    return result;
  }),

  nextAppointment: Ember.computed('model.patient.id', 'model.visit.startDate', function() {
    let patientId = this.get('model.patient.id');
    let visitDate = this.get('model.visit.startDate');
    let maxValue = this.get('maxValue');
    let promise = this.store.query('appointment', {
      options: {
        startkey: [patientId, null, null, 'appointment_'],
        endkey: [patientId, maxValue, maxValue, maxValue]
      },
      mapReduce: 'appointments_by_patient'
    }).then(function(result) {
      let futureAppointments = result.filter(function(data) {
        let startDate = data.get('startDate');
        return startDate && moment(startDate).isAfter(moment(visitDate), 'day');
      }).sortBy('startDate');
      if (!futureAppointments.length) {
        return '';
      }
      let [appointment] = [futureAppointments];
      let res = appointment.get('startDate');
      return res;
    });
    return DS.PromiseObject.create({ promise });
  }),

  additionalButtons: Ember.computed('model.{isNew}', function() {
    // let i18n = get(this, 'i18n');
    let isNew = this.get('model.isNew');
    if (!isNew) {
      return [{
        class: 'btn btn-primary on-white',
        buttonAction: 'printReport',
        buttonIcon: 'octicon octicon-check',
        buttonText: 'Print'
      }];
    }
  }),

  updateCapability: 'add_report',

  beforeUpdate() {
    return new Ember.RSVP.Promise(function(resolve) {
      if (this.get('model.isNew')) {

        if (this.get('model.visit.outPatient')) {
          this.get('model').set('reportType', 'OPD Report');
          let appointmentDate = this.get('nextAppointment').get('content');
          this.get('model').set('nextAppointment', appointmentDate);
          this.get('model').set('diagnosis', this.get('diagnosis'));
        } else {
          // update discharge report properties
          this.get('model').set('reportType', 'Discharge Report');
        }
      }
      resolve();
    }.bind(this));
  },

  afterUpdate() {
    let alertTitle = this.get('i18n').t('reports.titles.saved');
    let alertMessage = this.get('i18n').t('reports.messages.saved');
    this.saveVisitIfNeeded(alertTitle, alertMessage);
    let editTitle = this.get('model.visit.outPatient') ? this.get('i18n').t('reports.opd.titles.edit') : this.get('i18n').t('reports.discharge.titles.edit');
    let sectionDetails = {};
    sectionDetails.currentScreenTitle = editTitle;
    this.send('setSectionHeader', sectionDetails);
  },

  actions: {
    printReport() {
      window.print();
    }
  }

});
