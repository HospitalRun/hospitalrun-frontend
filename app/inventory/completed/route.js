import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'inv-request',
    pageTitle: 'History',
    
    _getStartKeyFromItem: function(item) {
        return ['Completed', 'inv-request_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        return {
            options: {
                startkey: ['Completed',,],
                endkey: ['Completed','\uffff','inv-request_\uffff']
            },
            mapReduce: 'inventory_request_by_status'
        };
    }
});