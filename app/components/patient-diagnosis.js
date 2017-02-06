import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import { translationMacro as t } from 'ember-i18n';
import UserSession from 'hospitalrun/mixins/user-session';

const {
  computed,
  get
} = Ember;

const DIAGNOSIS_KEYS = [
  'diagnosisContainer',
  'hideInActiveDiagnoses',
  'diagnosisContainer.diagnoses.@each.active',
  'diagnosisContainer.diagnoses.@each.secondaryDiagnosis'
];

export default Ember.Component.extend(PatientDiagnosis, UserSession, {
  i18n: Ember.inject.service(),
  allowAddDiagnosis: false,
  diagnosisContainer: null,
  diagnosisProperty: null,
  diagnosisList: null,
  editDiagnosisAction: 'editDiagnosis',
  hideInActiveDiagnoses: true,
  showAddDiagnosisAction: 'showAddDiagnosis',
  primaryDiagnosisLabel: t('patients.labels.primaryDiagnosis'),
  secondaryDiagnosisLabel: t('patients.labels.secondaryDiagnosis'),

  canAddDiagnosis: computed('allowAddDiagnosis', {
    get() {
      let allowAddDiagnosis = get(this, 'allowAddDiagnosis');
      return allowAddDiagnosis && this.currentUserCan('add_diagnosis');
    }
  }),

  havePrimaryDiagnoses: computed('primaryDiagnoses.length', {
    get() {
      let primaryDiagnosesLength = this.get('primaryDiagnoses.length');
      return (primaryDiagnosesLength > 0);
    }
  }),

  haveSecondaryDiagnoses: computed('secondaryDiagnoses.length', {
    get() {
      let secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
      return (secondaryDiagnosesLength > 0);
    }
  }),

  primaryDiagnoses: computed(...DIAGNOSIS_KEYS, {
    get() {
      let diagnosisContainer = this.get('diagnosisContainer');
      let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
      return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, false);
    }
  }),

  secondaryDiagnoses: computed(...DIAGNOSIS_KEYS,  {
    get() {
      let diagnosisContainer = this.get('diagnosisContainer');
      let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
      return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, true);
    }
  }),

  showPrimaryDiagnoses: computed('canAddDiagnosis', 'havePrimaryDiagnoses', {
    get() {
      return this.get('canAddDiagnosis') || this.get('havePrimaryDiagnoses');
    }
  }),

  actions: {
    editDiagnosis(diagnosis) {
      this.sendAction('editDiagnosisAction', diagnosis);
    },

    showAddDiagnosis() {
      this.sendAction('showAddDiagnosisAction');
    }
  }

});
