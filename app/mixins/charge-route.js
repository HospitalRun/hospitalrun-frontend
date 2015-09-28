import Ember from 'ember';
export default Ember.Mixin.create({
    pouchdb: Ember.inject.service(),
    actions: {
        deleteCharge: function(model) {
            this.controller.send('deleteCharge', model);
        }
    },
        
    setupController: function(controller, model) {
        this._super(controller, model);
        var maxId = this.get('pouchdb').getPouchId({}, 'pricing'),
            minId = this.get('pouchdb').getPouchId(null, 'pricing'),
            pricingCategory = this.get('pricingCategory'),
            pricingQuery = {
                startkey:  [pricingCategory,null,null,minId],
                endkey: [pricingCategory,{},{},maxId],
                include_docs: true,
            };        
        this.get('pouchdb').queryMainDB(pricingQuery, 'pricing_by_category').then(function(result) {
            var pricingList = result.rows.map(function(item) {
                return item.doc;
            });
            controller.set('pricingList', pricingList);
        });
    }
});