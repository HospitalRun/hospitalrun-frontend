import Ember from 'ember';
export default Ember.Mixin.create({
  
  patientImaging: function() {
    return this._getVisitCollection('imaging');
  }.property('model.visits.[].imaging'),

  patientLabs: function() {
    return this._getVisitCollection('labs');
  }.property('model.visits.[].labs'),

  patientMedications: function() {
    return this._getVisitCollection('medication');
  }.property('model.visits.[].medication'),

  patientProcedures: function() {
    return this._getVisitCollection('procedures');
  }.property('model.visits.[].procedures'),  

  haveProcedures: function() {
    var proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }.property('patientProcedures.length'),

  _getVisitCollection: function(name) {
    var returnList = [],
      visits = this.get('model.visits');
    if (!Ember.isEmpty(visits)) {
      visits.forEach(function(visit) {
        visit.get(name).then(function(items) {
          returnList.addObjects(items);
          if (returnList.length > 0) {
            returnList[0].set('first', true);
          }
        });
      });
    }
    return returnList;
  }
});