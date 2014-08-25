import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Requests',
    
    actions: {
        completeItem: function(item) {
            item.set('isCompleting', true);
            this.transitionTo('labs.edit', item);
        }, 
    },

    model: function() {
        return this.store.find('lab', {status:'Requested'});
    },
});