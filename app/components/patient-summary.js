import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
export default Ember.Component.extend(PatientDiagnosis, {
  classNames: ['patient-summary'],
  disablePatientLink: false,
  editProcedureAction: 'editProcedure',
  patient: null,
  patientProcedures: null,
  showPatientAction: 'showPatient',
  visits: null,

  havePrimaryDiagnoses: function() {
    let primaryDiagnosesLength = this.get('primaryDiagnoses.length');
    return (primaryDiagnosesLength > 0);
  }.property('primaryDiagnoses.length'),

  haveProcedures: function() {
    let proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }.property('patientProcedures.length'),

  haveSecondaryDiagnoses: function() {
    let secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
    return (secondaryDiagnosesLength > 0);
  }.property('secondaryDiagnoses.length'),

  primaryDiagnoses: function() {
    let visits = this.get('visits');
    return this.getPrimaryDiagnoses(visits);
  }.property('visits.[]'),

  secondaryDiagnoses: function() {
    let visits = this.get('visits');
    return this.getSecondaryDiagnoses(visits);
  }.property('visits.[]'),

  shouldLinkToPatient: function() {
    let disablePatientLink = this.get('disablePatientLink');
    return !disablePatientLink;
  }.property('disablePatientLink'),

  actions: {
    linkToPatient: function() {
      let shouldLink = this.get('shouldLinkToPatient');
      if (shouldLink) {
        let patient = this.get('patient');
        let returnTo = this.get('returnTo');
        let returnToContext = this.get('returnToContext');
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
    }
  }
});
