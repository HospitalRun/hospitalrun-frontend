import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import PatientVisitTypes from 'hospitalrun/mixins/patient-visit-types';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Component.extend(PatientDiagnosis, PatientVisits, PatientVisitTypes, UserSession, {
  canAddNote: function() {
    return this.currentUserCan('add_note');
  },
  
  classNames: ['patient-summary'],
  disablePatientLink: false,
  editProcedureAction: 'editProcedure',
  model: null,
  //patient: null,
  //patientProcedures: null,
  showPatientAction: 'showPatient',
  openModalAction: 'openModal',
  store: null,
  
  shouldLinkToPatient: function() {
    var disablePatientLink = this.get('disablePatientLink');
    return !disablePatientLink;
  }.property('disablePatientLink'),

  actions: {
    linkToPatient: function() {
      var shouldLink = this.get('shouldLinkToPatient');
      if (shouldLink) {
        var patient = this.get('patient'),
          returnTo = this.get('returnTo'),
          returnToContext = this.get('returnToContext');
        patient.set('returnTo', returnTo);
        patient.set('returnToContext', returnToContext);
        this.sendAction('showPatientAction', this.get('model'));
      }
    },
    editProcedure: function(procedure) {
      procedure.set('returnToVisit', false);
      procedure.set('returnToPatient', true);
      procedure.set('patient', this.get('model'));
      this.sendAction('editProcedureAction', procedure);
    },
    showPatientHistory: function(model) {  
      this.sendAction('openModalAction', 'patients.history', model);
    },
    showAddPatientNote: function(model) {
      if (Ember.isEmpty(model)) {
        model = this.get('store').createRecord('patient-note', { patient: this.get('model') });
      }
      this.sendAction('openModalAction', 'patients.notes', model);
    }
  }
});
