import { alias } from '@ember/object/computed';
import { get } from '@ember/object';
import OperativePlanController from 'hospitalrun/patients/operative-plan/controller';

export default OperativePlanController.extend({
  additionalButtons: null,
  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.assistant',
    id: 'physician_list'
  }, {
    name: 'physicianList',
    property: 'model.surgeon',
    id: 'physician_list'
  }, {
    name: 'procedureList',
    property: 'modelProcedures',
    id: 'procedure_list'
  }],
  updateCapability: 'add_operation_report',

  diagnosisList: alias('patientController.diagnosisList'),

  _finishAfterUpdate() {
    let i18n = get(this, 'i18n');
    let updateMessage = i18n.t('operationReport.messages.reportSaved');
    let updateTitle = i18n.t('operationReport.titles.reportSaved');
    this.displayAlert(updateTitle, updateMessage);
  },

  actions: {
    addDiagnosis(newDiagnosis) {
      this.addDiagnosisToModelAndPatient(newDiagnosis);
    }
  }

});
