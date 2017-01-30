import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import { addProcedure } from 'hospitalrun/components/operative-procedures';
import { COMPLETED_STATUS } from 'hospitalrun/mixins/operative-plan-statuses';
import OperativePlanStatuses from 'hospitalrun/mixins/operative-plan-statuses';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

const {
  computed,
  computed: { alias },
  get,
  inject,
  RSVP,
  set
} = Ember;

// Properties to copy from plan to operative report
const PLAN_KEYS_TO_COPY = [
  'additionalNotes',
  'caseComplexity',
  'customForms',
  'patient',
  'procedures',
  'operationDescription',
  'surgeon',
  'surgeryDate'
];

export default AbstractEditController.extend(OperativePlanStatuses, PatientSubmodule, {
  completedPlan: false,
  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.surgeon',
    id: 'physician_list'
  }, {
    name: 'procedureList',
    property: 'modelProcedures',
    id: 'procedure_list'
  }],
  newPlan: false,
  updateCapability: 'add_operative_plan',

  patientsController: inject.controller('patients'),

  physicianList: alias('patientsController.physicianList'),
  procedureList: alias('patientsController.procedureList'),

  additionalButtons: computed('model.{isNew,status}', function() {
    let i18n = get(this, 'i18n');
    let isNew = get(this, 'model.isNew');
    let status = get(this, 'model.status');
    if (!isNew && status !== COMPLETED_STATUS) {
      return [{
        class: 'btn btn-primary on-white',
        buttonAction: 'completePlan',
        buttonIcon: 'octicon octicon-check',
        buttonText: i18n.t('operativePlan.buttons.completePlan')
      }];
    }
  }),

  modelProcedures: computed.map('model.procedures', function(procedure) {
    return get(procedure, 'description');
  }),

  afterUpdate() {
    let newPlan = get(this, 'newPlan');
    if (newPlan) {
      let patient = get(this, 'model.patient');
      patient.save().then(this._finishAfterUpdate.bind(this));
    } else {
      this._finishAfterUpdate();
    }
  },

  beforeUpdate() {
    let model = get(this, 'model');
    let isNew = get(model, 'isNew');
    let status = get(model, 'status');
    addProcedure(model);
    set(this, 'newPlan', isNew);
    if (status === COMPLETED_STATUS) {
      let changedAttributes = model.changedAttributes();
      if (changedAttributes.status) {
        set(this, 'completedPlan', true);
      }
    } else {
      set(this, 'completedPlan', false);
    }
    if (isNew) {
      return this.saveNewDiagnoses();
    } else {
      return RSVP.resolve();
    }
  },

  _createOperationReport() {
    let store = get(this, 'store');
    let operativePlan = get(this, 'model');
    let propertiesToCopy = operativePlan.getProperties(...PLAN_KEYS_TO_COPY);
    let diagnoses = get(operativePlan, 'diagnoses');
    let patient = get(operativePlan, 'patient');
    set(propertiesToCopy, 'operativePlan', operativePlan);
    set(propertiesToCopy, 'preOpDiagnosis', diagnoses);
    set(propertiesToCopy, 'returnToPatient', get(patient, 'id'));
    let operationReport = store.createRecord('operation-report', propertiesToCopy);
    this.getPatientDiagnoses(patient, operationReport);
    operationReport.save().then((newReport) => {
      patient.save().then(()=> {
        let i18n = get(this, 'i18n');
        let updateMessage = i18n.t('operativePlan.messages.planCompleted');
        let updateTitle = i18n.t('operativePlan.titles.planCompleted');
        this.displayAlert(updateTitle, updateMessage, 'showOperationReport', newReport, 'ok');
      });
    });
  },

  _finishAfterUpdate() {
    let completedPlan = get(this, 'completedPlan');
    if (completedPlan) {
      this._createOperationReport();
    } else {
      let i18n = get(this, 'i18n');
      let updateMessage = i18n.t('operativePlan.messages.planSaved');
      let updateTitle = i18n.t('operativePlan.titles.planSaved');
      this.displayAlert(updateTitle, updateMessage);
    }
  },

  actions: {
    completePlan() {
      let model = get(this, 'model');
      set(model, 'status', COMPLETED_STATUS);
      this.send('update');
    }
  }
});
