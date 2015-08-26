import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'imaging',
    pageTitle: 'Imaging Requests',
    searchStatus: 'Requested',
    
    _getStartKeyFromItem: function(item) {
        var imagingDateAsTime = item.get('imagingDateAsTime'),
            keyPrefix = this.get('keyPrefix'),
            requestedDateAsTime = item.get('requestedDateAsTime'),
            searchStatus = this.get('searchStatus');
        return [searchStatus, requestedDateAsTime, imagingDateAsTime, keyPrefix+item.get('id')];
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
            mapReduce: 'imaging_by_status'
        };
    }
});