import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    newButtonAction: 'newRequest',
    newButtonText: '+ new request',
    pageTitle: 'Requests',

    actions: {
        fulfill: function(item) {
            item.set('dateCompleted', new Date());
            this.transitionTo('inventory.request', item);
        }
    },

    model: function() {
        return this.store.find('inv-request', {status:'Requested'});
    },
});