import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import { COMPLETED_STATUS } from 'hospitalrun/mixins/operative-plan-statuses';
import OperativePlanStatuses from 'hospitalrun/mixins/operative-plan-statuses';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

const {
  computed,
  computed: { alias },
  get,
  inject,
  isEmpty,
  RSVP,
  set
} = Ember;

export default AbstractEditController.extend(OperativePlanStatuses, PatientSubmodule, {
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
    this._addProcedure();
    set(this, 'newPlan', get(this, 'model.isNew'));
    return RSVP.resolve();
  },

  haveProcedures: computed('model.procedures.[]', {
    get() {
      return !isEmpty(get(this, 'model.procedures'));
    }
  }),

  _addProcedure() {
    let model = get(this, 'model');
    let procedures = get(model, 'procedures');
    let description = get(model, 'procedureDescription');
    if (!isEmpty(description)) {
      procedures.addObject({
        description
      });
      set(model, 'procedureDescription', null);
    }
  },

  _finishAfterUpdate() {
    let i18n = get(this, 'i18n');
    let updateMessage = i18n.t('operativePlan.messages.planSaved');
    let updateTitle = i18n.t('operativePlan.titles.planSaved');
    this.displayAlert(updateTitle, updateMessage);
  },

  actions: {
    addProcedure() {
      this._addProcedure();
    },

    completePlan() {
      let model = get(this, 'model');
      set(model, 'status', COMPLETED_STATUS);
      this.send('update');
    },

    deleteProcedure(procedureToDelete) {
      let model = get(this, 'model');
      let procedures = get(model, 'procedures');
      procedures.removeObject(procedureToDelete);
      model.validate();
    }
  }
});
