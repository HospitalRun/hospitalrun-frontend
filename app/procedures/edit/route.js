import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
export default AbstractEditRoute.extend(ChargeRoute, {
    editTitle: 'Edit Procedure', 
    modelName: 'procedure',
    newTitle: 'New Procedure',
    pricingCategory: 'Procedure',
    
    setupController: function(controller, model) {
        this._super(controller, model);
        var medicationQuery = {
            startkey:  ['Medication','inventory_'],
            endkey: ['Medication','inventory_\uffff'],
            include_docs: true,
        };
        this.controllerFor('pouchdb').queryMainDB(medicationQuery, 'inventory_by_type').then(function(result) {
            var medicationList = result.rows.map(function(medication) {
                return medication.doc;
            });
            controller.set('medicationList', medicationList);
        });
    }
});