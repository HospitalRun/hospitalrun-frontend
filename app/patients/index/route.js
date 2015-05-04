import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({
    modelName: 'patient',
    pageTitle: 'Patient Listing',
    
    _getStartKeyFromItem: function(item) {
        var displayPatientId =item.get('displayPatientId');
        return [displayPatientId,'patient_'+item.get('id')];
    },
    
    _modelQueryParams: function(params) {
        var queryParams = {
            mapReduce: 'patient_by_display_id'
        };
        if (!Ember.isEmpty(params.sortDesc)) {
            queryParams.sortDesc = params.sortDesc;
        }
        if (!Ember.isEmpty(params.sortKey)) {
            queryParams.sortKey = params.sortKey;
        }
        return queryParams;
    }

});