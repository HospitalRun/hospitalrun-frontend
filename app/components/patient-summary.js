import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import UserSession from 'hospitalrun/mixins/user-session';

const {
  computed,
  get,
  isEmpty,
  set
} = Ember;

const DIAGNOSIS_KEYS = [
  'diagnosisContainer',
  'hideInActiveDiagnoses',
  'diagnosisContainer.diagnoses.@each.active',
  'diagnosisContainer.diagnoses.@each.secondaryDiagnosis'
];

export default Ember.Component.extend(PatientDiagnosis, UserSession, {
  allowAddAllergy: false,
  allowAddDiagnosis: false,
  allowAddOperativePlan: false,
  classNames: ['patient-summary'],
  diagnosisContainer: null,
  diagnosisList: null,
  disablePatientLink: false,
  editDiagnosisAction: 'editDiagnosis',
  editOperativePlanAction: 'editOperativePlan',
  editOperationReportAction: 'editOperationReport',
  editProcedureAction: 'editProcedure',
  hideInActiveDiagnoses: true,
  patient: null,
  patientProcedures: null,
  showAddDiagnosisAction: 'showAddDiagnosis',
  showPatientAction: 'showPatient',

  canAddAllergy: computed('allowAddAllergy', {
    get() {
      let allowAddAllergy = get(this, 'allowAddAllergy');
      return allowAddAllergy && this.currentUserCan('add_allergy');
    }
  }),

  canAddDiagnosis: computed('allowAddAllergy', {
    get() {
      let allowAddDiagnosis = get(this, 'allowAddDiagnosis');
      return allowAddDiagnosis && this.currentUserCan('add_diagnosis');
    }
  }),

  canAddOperativePlan: computed('allowAddOperativePlan', {
    get() {
      let allowAddOperativePlan = get(this, 'allowAddOperativePlan');
      return allowAddOperativePlan && this.currentUserCan('add_operative_plan');
    }
  }),

  currentOperativePlan: computed('patient.operativePlans.@each.status', {
    get() {
      let operativePlans = get(this, 'patient.operativePlans');
      return operativePlans.findBy('isPlanned', true);
    }
  }),

  havePrimaryDiagnoses: computed('primaryDiagnoses.length', function() {
    let primaryDiagnosesLength = this.get('primaryDiagnoses.length');
    return (primaryDiagnosesLength > 0);
  }),

  haveProcedures: computed('patientProcedures.length', function() {
    let proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }),

  haveSecondaryDiagnoses: computed('secondaryDiagnoses.length', function() {
    let secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
    return (secondaryDiagnosesLength > 0);
  }),

  primaryDiagnoses: computed(...DIAGNOSIS_KEYS, function() {
    let diagnosisContainer = this.get('diagnosisContainer');
    let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
    return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, false);

  }),

  secondaryDiagnoses: computed(...DIAGNOSIS_KEYS, function() {
    let diagnosisContainer = this.get('diagnosisContainer');
    let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
    return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, true);
  }),

  shouldLinkToPatient: computed('disablePatientLink', function() {
    let disablePatientLink = this.get('disablePatientLink');
    return !disablePatientLink;
  }),

  showPrimaryDiagnoses: computed('canAddDiagnosis', 'havePrimaryDiagnoses', function() {
    return this.get('canAddDiagnosis') || this.get('havePrimaryDiagnoses');
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    let diagnosisContainer = get(this, 'diagnosisContainer');
    if (isEmpty(diagnosisContainer)) {
      set(this, 'diagnosisContainer', get(this, 'patient'));
    }
  },

  actions: {
    addOperativePlan() {
      this.sendAction('editOperativePlanAction');
    },

    editOperativePlan(operativePlan) {
      this.sendAction('editOperativePlanAction', operativePlan);
    },

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

    editDiagnosis(diagnosis) {
      this.sendAction('editDiagnosisAction', diagnosis);
    },

    editProcedure(procedure) {
      let report = get(procedure, 'report');
      if (isEmpty(report)) {
        this.sendAction('editProcedureAction', procedure);
      } else {
        this.sendAction('editOperationReportAction', report);
      }
    },

    showAddDiagnosis() {
      this.sendAction('showAddDiagnosisAction');
    }

  }
});
