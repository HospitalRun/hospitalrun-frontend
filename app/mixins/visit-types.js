import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  defaultVisitTypes: [
    'Admission',
    'Clinic',
    'Followup',
    'Imaging',
    'Lab',
    'Pharmacy'
  ],

  _getVisitTypes: function(includeEmpty) {
    let defaultVisitTypes = this.get('defaultVisitTypes');
    let visitTypesList = this.get('visitTypesList');
    let visitList;
    if (Ember.isEmpty(visitTypesList)) {
      visitList = defaultVisitTypes;
    } else {
      visitList = visitTypesList.get('value');
    }
    visitList = SelectValues.selectValues(visitList, includeEmpty);
    return visitList;
  },

  visitTypes: function() {
    return this._getVisitTypes();
  }.property('visitTypesList', 'defaultVisitTypes').volatile(),

  visitTypesWithEmpty: function() {
    return this._getVisitTypes(true);
  }.property('visitTypesList', 'defaultVisitTypes').volatile()
});
