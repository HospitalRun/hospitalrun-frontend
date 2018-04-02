import Mixin from '@ember/object/mixin';
import { isEmpty } from '@ember/utils';

export default Mixin.create({
  _addDiagnosisToList(diagnosis, diagnosesList) {
    if (!isEmpty(diagnosis)) {
      if (isEmpty(diagnosesList.findBy('description', diagnosis))) {
        diagnosesList.addObject(diagnosis);
      }
    }
  },

  getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, secondaryDiagnoses, diagnosisProperty = 'diagnoses') {
    let diagnosesList = [];
    if (!isEmpty(diagnosisContainer)) {
      let diagnoses = diagnosisContainer.get(diagnosisProperty);
      diagnoses = diagnoses.filterBy('archived', false);
      if (hideInActiveDiagnoses) {
        diagnoses = diagnoses.filterBy('active', true);
      }
      if (!secondaryDiagnoses) {
        secondaryDiagnoses = false;
      }
      diagnoses = diagnoses.filterBy('secondaryDiagnosis', secondaryDiagnoses);
      diagnoses.forEach((diagnosis) => {
        this._addDiagnosisToList(diagnosis, diagnosesList);
      });
      return diagnosesList;
    }
  }
});
