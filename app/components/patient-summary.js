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

  havePrimaryDiagnoses: Ember.computed('primaryDiagnosis.length', function() {
    let primaryDiagnosesLength = this.get('primaryDiagnoses.length');
    return (primaryDiagnosesLength > 0);
  }),

  haveProcedures: Ember.computed('patientProcedures.length', function() {
    let proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }),

  haveSecondaryDiagnoses: Ember.computed('secondaryDiagnoses.length', function() {
    let secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
    return (secondaryDiagnosesLength > 0);
  }),

  primaryDiagnoses: Ember.computed('visits.[]', function() {
    let visits = this.get('visits');
    return this.getPrimaryDiagnoses(visits);
  }),

  secondaryDiagnoses: Ember.computed('visits.[]', function() {
    let visits = this.get('visits');
    return this.getSecondaryDiagnoses(visits);
  }),

  shouldLinkToPatient: Ember.computed('disablePatientLink', function() {
    let disablePatientLink = this.get('disablePatientLink');
    return !disablePatientLink;
  }),

  hasAllergies: Ember.computed('patient.allergies.[]', function() {
    return Ember.computed.notEmpty('patient.allergies');
  }),

  actions: {
    linkToPatient() {
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
    editProcedure(procedure) {
      procedure.set('returnToVisit', false);
      procedure.set('returnToPatient', true);
      procedure.set('patient', this.get('patient'));
      this.sendAction('editProcedureAction', procedure);
    }
  }
});
