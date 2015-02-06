import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({    
    modelName: 'inv-request',
    pageTitle: 'History',
    
    _getStartKeyFromItem: function(item) {
        var dateCompleted = item.get('dateCompleted');
        if (!Ember.isEmpty(dateCompleted)) {
            dateCompleted = new Date(dateCompleted).getTime();
        }
        return ['Completed',dateCompleted,'inv-request_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue');
        return {
            options: {
                startkey: ['Completed',,],
                endkey: ['Completed',maxValue,maxValue]
            },
            mapReduce: 'inventory_request_by_status'
        };
    }
});