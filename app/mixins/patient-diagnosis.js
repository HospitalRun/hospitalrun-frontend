import Ember from 'ember';
export default Ember.Mixin.create({
  _addDiagnosisToList: function (diagnosis, diagnosesList, visit) {
    if (!Ember.isEmpty(diagnosis)) {
      if (Ember.isEmpty(diagnosesList.findBy('description', diagnosis))) {
        diagnosesList.addObject({
          date: visit.get('startDate'),
          description: diagnosis
        });
      }
    }
  },

  getPrimaryDiagnoses: function (visits) {
    var diagnosesList = [];
    if (!Ember.isEmpty(visits)) {
      visits.forEach(function (visit) {
        this._addDiagnosisToList(visit.get('primaryDiagnosis'), diagnosesList, visit);
        this._addDiagnosisToList(visit.get('primaryBillingDiagnosis'), diagnosesList, visit);
      }.bind(this));
    }
    var firstDiagnosis = diagnosesList.get('firstObject');
    if (!Ember.isEmpty(firstDiagnosis)) {
      firstDiagnosis.first = true;
    }
    return diagnosesList;
  },

  getSecondaryDiagnoses: function (visits) {
    var diagnosesList = [];
    if (!Ember.isEmpty(visits)) {
      visits.forEach(function (visit) {
        if (!Ember.isEmpty(visit.get('additionalDiagnoses'))) {
          diagnosesList.addObjects(visit.get('additionalDiagnoses'));
        }
      });
    }

    var firstDiagnosis = diagnosesList.get('firstObject');
    if (!Ember.isEmpty(firstDiagnosis)) {
      firstDiagnosis.first = true;
    }
    return diagnosesList;
  },

});
