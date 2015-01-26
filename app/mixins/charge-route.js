import Ember from "ember";
export default Ember.Mixin.create({
    actions: {
        deleteCharge: function(model) {
            this.controller.send('deleteCharge', model);
        }
    },
        
    setupController: function(controller, model) {
        this._super(controller, model);
        var pricingQuery = {
            startkey:  ['Procedure Charges','pricing_'],
            endkey: ['Procedure Charges','pricing_\uffff'],
            include_docs: true,
        };        
        this.controllerFor('pouchdb').queryMainDB(pricingQuery, 'pricing_by_category').then(function(result) {
            var pricingList = result.rows.map(function(item) {
                return item.doc;
            });
            controller.set('pricingList', pricingList);
        });
    }
});