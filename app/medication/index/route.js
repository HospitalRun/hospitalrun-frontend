import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'medication',
    pageTitle: 'Medication Requests',
    searchStatus: 'Requested',
    
    _getStartKeyFromItem: function(item) {
        var prescriptionDateAsTime = item.get('prescriptionDateAsTime'),
            keyPrefix = this.get('keyPrefix'),
            requestedDateAsTime = item.get('requestedDateAsTime'),
            searchStatus = this.get('searchStatus');
        return [searchStatus, requestedDateAsTime, prescriptionDateAsTime, keyPrefix+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var keyPrefix = this.get('keyPrefix'),
            maxValue = this.get('maxValue'),
            searchStatus = this.get('searchStatus');
        return {
            options: {
                startkey: [searchStatus, null, null, keyPrefix],
                endkey: [searchStatus, maxValue, maxValue, keyPrefix+maxValue]
            },
            mapReduce: 'medication_by_status'
        };
    }
});