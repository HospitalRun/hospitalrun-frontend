import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'imaging',
    pageTitle: 'Requests',
    
    _getStartKeyFromItem: function(item) {
        return ['Requested', 'imaging_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        return {
            options: {
                startkey: ['Requested',],
                endkey: ['Requested','imaging_\uffff']
            },
            mapReduce: 'imaging_by_status'
        };
    },    
    
    actions: {
        completeItem: function(item) {
            item.set('isCompleting', true);
            this.transitionTo('imaging.edit', item);
        }, 
    }
});