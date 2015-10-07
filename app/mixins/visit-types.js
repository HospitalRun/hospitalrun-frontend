import Ember from "ember";
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
    
    visitTypes: function() {
        var defaultVisitTypes = this.get('defaultVisitTypes'),
            visitTypesList = this.get('visitTypesList'),
            visitList;
        if (Ember.isEmpty(visitTypesList)) {
            visitList = defaultVisitTypes;
        } else {
            visitList = visitTypesList.get('value');
        }
        visitList = SelectValues.selectValues(visitList);
        return visitList;
    }.property('visitTypesList', 'defaultVisitTypes'),
});