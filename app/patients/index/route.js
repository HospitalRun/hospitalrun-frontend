import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'patient',
    pageTitle: 'Patient Listing',
    
    _getStartKeyFromItem: function(item) {
        var displayPatientId =item.get('displayPatientId');
        return [displayPatientId,'patient_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        return {
            mapReduce: 'patient_by_display_id'
        };
    },
    
});