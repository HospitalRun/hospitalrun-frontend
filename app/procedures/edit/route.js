import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Procedure', 
    modelName: 'procedure',
    newTitle: 'New Procedure',
    
    actions: {
        deleteConsumable: function(model) {
            this.controller.send('deleteConsumable', model);
        },
        
        deleteEquipment: function(model) {
            this.controller.send('deleteEquipment', model);
        }
    },
        
    setupController: function(controller, model) {
        this._super(controller, model);
        var inventoryQuery = {
            startkey:  'inventory_',
            endkey: 'inventory_\uffff',
            include_docs: true,
        };        
        this.controllerFor('pouchdb').queryMainDB(inventoryQuery).then(function(result) {
            var inventoryList = result.rows.map(function(item) {
                return item.doc;
            });
            controller.set('inventoryList', inventoryList);
        });
    }
});