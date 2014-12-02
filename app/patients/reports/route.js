import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Patient Report',

    afterModel: function() {
        this.set('inventoryItems', this.modelFor('inventory'));
    },
    
    model: function() {
        return this.store.find('visit');
    }

});
