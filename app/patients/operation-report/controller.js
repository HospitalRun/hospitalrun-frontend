import Ember from 'ember';
import OperativePlanController from 'hospitalrun/patients/operative-plan/controller';

const { computed: { alias } } = Ember;

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

  actions: {
    addDiagnosis(newDiagnosis) {
      this.addDiagnosisToModelAndPatient(newDiagnosis);
    }
  }

});
