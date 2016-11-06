import Ember from 'ember';
export default Ember.Mixin.create({
  database: Ember.inject.service(),
  actions: {
    deleteCharge: function(model) {
      this.controller.send('deleteCharge', model);
    }
  },
  pricingList: null,

  afterModel: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let database = this.get('database');
      let maxId = database.getPouchId({}, 'pricing');
      let minId = database.getPouchId(null, 'pricing');
      let pricingCategory = this.get('pricingCategory');
      let pricingQuery = {
        startkey: [pricingCategory, null, null, minId],
        endkey: [pricingCategory, {}, {}, maxId],
        include_docs: true
      };
      database.queryMainDB(pricingQuery, 'pricing_by_category').then(function(result) {
        let pricingList = result.rows.map(function(item) {
          return item.doc;
        });
        this.set('pricingList', pricingList);
        resolve();
      }.bind(this)).catch(reject);
    }.bind(this));
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('pricingList', this.get('pricingList'));
  }
});
