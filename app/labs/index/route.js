import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'lab',
    pageTitle: 'Lab Requests',
    searchStatus: 'Requested',
    
    _getStartKeyFromItem: function(item) {
        var labDateAsTime = item.get('labDateAsTime'),
            keyPrefix = this.get('keyPrefix'),
            requestedDateAsTime = item.get('requestedDateAsTime'),
            searchStatus = this.get('searchStatus');
        return [searchStatus, requestedDateAsTime, labDateAsTime, keyPrefix+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var keyPrefix = this.get('keyPrefix'),
            maxValue = this.get('maxValue'),
            searchStatus = this.get('searchStatus');
        return {
            options: {
                startkey: [searchStatus, , ,keyPrefix],
                endkey: [searchStatus, maxValue, maxValue, keyPrefix+maxValue]
            },
            mapReduce: 'lab_by_status'
        };
    },
    
    actions: {
        completeItem: function(item) {
            item.set('isCompleting', true);
            this.transitionTo('labs.edit', item);
        }, 
    }
});