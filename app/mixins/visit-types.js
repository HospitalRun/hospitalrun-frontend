import Ember from "ember";
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
            visitTypesList = this.get('visitTypesList');
        if (Ember.isEmpty(visitTypesList)) {
            return defaultVisitTypes;
        } else {
            return visitTypesList.get('value');
        }
    }.property('visitTypesList', 'defaultVisitTypes'),
});