import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    modelName: 'inv-request',
    moduleName: 'inventory-queue',
    newButtonText: '+ new request',
    
    actions: {
        fulfill: function(item) {      
            this.set('currentItem', item);
            this.send('openModal', 'inventory.fulfill', item);
        }
    },
    
    model: function() {
        return this.store.find(this.get('modelName'), {status:'Requested'});
    },

    /**
     * Don't render into the section template
     */
    renderTemplate: function() {
        this.render();
    },
    
    setupController: function(controller, model) { 
        this.send('setPageTitle', 'Inventory Requests');
        this._super(controller, model);
    }
    
});