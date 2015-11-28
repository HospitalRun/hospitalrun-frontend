import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Component.extend(PatientDiagnosis, UserSession, {
  canAddNote: function() {
    return this.currentUserCan('add_note');
  },
  
  classNames: ['patient-summary'],
  disablePatientLink: false,
  editProcedureAction: 'editProcedure',
  patient: null,
  patientProcedures: null,
  showPatientAction: 'showPatient',
  openModalAction: 'openModal',
  store: null,
  visits: null,

  havePrimaryDiagnoses: function() {
    var primaryDiagnosesLength = this.get('primaryDiagnoses.length');
    return (primaryDiagnosesLength > 0);
  }.property('primaryDiagnoses.length'),

  haveProcedures: function() {
    var proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }.property('patientProcedures.length'),

  haveSecondaryDiagnoses: function() {
    var secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
    return (secondaryDiagnosesLength > 0);
  }.property('secondaryDiagnoses.length'),

  primaryDiagnoses: function() {
    var visits = this.get('visits');
    return this.getPrimaryDiagnoses(visits);
  }.property('visits.[]'),

  secondaryDiagnoses: function() {
    var visits = this.get('visits');
    return this.getSecondaryDiagnoses(visits);
  }.property('visits.[]'),

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
        this.sendAction('showPatientAction', this.get('patient'));
      }
    },
    editProcedure: function(procedure) {
      procedure.set('returnToVisit', false);
      procedure.set('returnToPatient', true);
      procedure.set('patient', this.get('patient'));
      this.sendAction('editProcedureAction', procedure);
    },
    showPatientHistory: function() {      
      this.sendAction('openModalAction', 'patients/history', this.get('patient'));
    },
    showAddPatientNote: function(model) {
      if (Ember.isEmpty(model)) {
        model = this.get('store').createRecord('patient-note', {patient: this.get('patient')});
      }
      this.sendAction('openModalAction', 'patients/notes', model);
    }
  }
});
