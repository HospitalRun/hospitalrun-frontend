import Ember from 'ember';

const {
  isEmpty
} = Ember;

export default Ember.Mixin.create({
  _addDiagnosisToList(diagnosis, diagnosesList) {
    if (!Ember.isEmpty(diagnosis)) {
      if (Ember.isEmpty(diagnosesList.findBy('description', diagnosis))) {
        diagnosesList.addObject(diagnosis);
      }
    }
  },

  getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, secondaryDiagnoses, diagnosisProperty = 'diagnoses') {
    let diagnosesList = [];
    if (!isEmpty(diagnosisContainer)) {
      let diagnoses = diagnosisContainer.get(diagnosisProperty);
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
