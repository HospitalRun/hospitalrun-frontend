import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import UserSession from 'hospitalrun/mixins/user-session';

export default Component.extend(UserSession, {
  allowAddAllergy: false,
  allowAddDiagnosis: false,
  allowAddOperativePlan: false,
  classNames: ['patient-summary'],
  diagnosisContainer: null,
  diagnosisList: null,
  disablePatientLink: false,
  editAllergyAction: 'editAllergy',
  editDiagnosisAction: 'editDiagnosis',
  editOperativePlanAction: 'editOperativePlan',
  editOperationReportAction: 'editOperationReport',
  editProcedureAction: 'editProcedure',
  hideInActiveDiagnoses: true,
  patient: null,
  patientProcedures: null,
  showAddAllergyAction: 'showAddAllergy',
  showAddDiagnosisAction: 'showAddDiagnosis',
  showPatientAction: 'showPatient',

  canAddAllergy: computed('allowAddAllergy', {
    get() {
      let allowAddAllergy = get(this, 'allowAddAllergy');
      return allowAddAllergy && this.currentUserCan('add_allergy');
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

  haveProcedures: computed('patientProcedures.length', function() {
    let proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }),

  shouldLinkToPatient: computed('disablePatientLink', function() {
    let disablePatientLink = this.get('disablePatientLink');
    return !disablePatientLink;
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

    editAllergy(allergy) {
      this.sendAction('editAllergyAction', allergy);
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

    showAddAllergy() {
      this.sendAction('showAddAllergyAction');
    },

    showAddDiagnosis() {
      this.sendAction('showAddDiagnosisAction');
    }
  }
});
