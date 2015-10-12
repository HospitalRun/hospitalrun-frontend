import Ember from 'ember';
export default Ember.Mixin.create({
  database: Ember.inject.service(),
  actions: {
    deleteCharge: function(model) {
      this.controller.send('deleteCharge', model);
    }
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    const database = this.get('database');
    var maxId = database.getPouchId({}, 'pricing'),
      minId = database.getPouchId(null, 'pricing'),
      pricingCategory = this.get('pricingCategory'),
      pricingQuery = {
        startkey: [pricingCategory, null, null, minId],
        endkey: [pricingCategory, {}, {}, maxId],
        include_docs: true
      };
    database.queryMainDB(pricingQuery, 'pricing_by_category').then(function(result) {
      var pricingList = result.rows.map(function(item) {
        return item.doc;
      });
      controller.set('pricingList', pricingList);
    });
  }
});
