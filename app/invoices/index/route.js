import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({    
    modelName: 'invoice',
    pageTitle: 'Invoice Listing',
    
    _getStartKeyFromItem: function(item) {
        var billDateAsTime = item.get('labDateAsTime'),
            keyPrefix = this.get('keyPrefix'),            
            searchStatus = item.get('status');
        return [searchStatus, billDateAsTime, keyPrefix+item.get('id')];
    },
    
    _modelQueryParams: function(params) {
        var keyPrefix = this.get('keyPrefix'),
            queryParams,
            maxValue = this.get('maxValue'),            
            searchStatus = params.status;
        if (Ember.isEmpty(searchStatus)) {
            searchStatus = 'Billed';
        }
        this.set('pageTitle', '%@ Invoices'.fmt(searchStatus));
        queryParams = {
            options: {
                startkey: [searchStatus, null, keyPrefix],
                endkey: [searchStatus, maxValue, keyPrefix+maxValue]
            },
            mapReduce: 'invoice_by_status'
        };
        
        if (searchStatus === 'All') {
            delete queryParams.options.startkey;
            delete queryParams.options.endkey;
        }
        return queryParams;
        
    },
    
    queryParams: {
        startKey: {refreshModel: true},
        status: {refreshModel: true}
    },
});