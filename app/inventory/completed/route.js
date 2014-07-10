import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    queryParams: {
        id: {
            refreshModel: true
        }
    },
    
    pageTitle: 'Completed Requests',
    model: function(params) {
        if (!Ember.isEmpty(params.queryParams.id)) {
            return this.store.find('inv-request', {id: params.queryParams.id});
        } else {
            return this.store.find('inv-request', {status: 'Fulfilled'});
        }
    }
});