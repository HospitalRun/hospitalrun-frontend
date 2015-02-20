import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
    actions: {
        deleteCharge: function(model) {
            this.controller.send('deleteCharge', model);
        }
    },
        
    setupController: function(controller, model) {
        this._super(controller, model);
        var maxValue = this.get('maxValue'),
            pricingCategory = this.get('pricingCategory'),
            pricingQuery = {
                startkey:  [pricingCategory,null,null,'pricing_'],
                endkey: [pricingCategory,maxValue,maxValue,'pricing_'+maxValue],
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