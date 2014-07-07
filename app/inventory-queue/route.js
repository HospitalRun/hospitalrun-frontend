import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    modelName: 'inv-request',
    moduleName: 'inventory-queue',
    newButtonText: '+ new request',	
    /**
     * Don't render into the section template
     */
    renderTemplate: function() {
        this.render();
    },
    
    setupController: function(controller, model) { 
        this.send('setPageTitle', 'Inventory Queue');
        this._super(controller, model);
    }
    
});