import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

export default Ember.Mixin.create({
  defaultVisitTypes: Ember.computed(function() {
    let i18n = this.get('i18n');
    let types = [
      'admission',
      'clinic',
      'followup',
      'imaging',
      'lab',
      'pharmacy'
    ];
    return types.map((type) => {
      return i18n.t(`visits.types.${type}`);
    });
  }),

  _getVisitTypes(includeEmpty) {
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
