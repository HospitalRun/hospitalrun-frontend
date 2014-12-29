import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'imaging',
    pageTitle: 'Completed',
    
    _getStartKeyFromItem: function(item) {
        return ['Completed', item.get('id')];
    },
    
    _modelQueryParams: function() {
        return {
            options: {
                startkey: ['Completed',],
                endkey: ['Completed','imaging_\uffff']
            },
            mapReduce: 'imaging_by_status'
        };
    }
});