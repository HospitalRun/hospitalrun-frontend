import { Promise as EmberPromise } from 'rsvp';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  database: service(),
  actions: {
    deleteCharge(model) {
      this.controller.send('deleteCharge', model);
    }
  },
  pricingList: null,

  afterModel() {
    return new EmberPromise(function(resolve, reject) {
      let database = this.get('database');
      let maxId = database.getMaxPouchId('pricing');
      let minId = database.getMinPouchId('pricing');
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

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('pricingList', this.get('pricingList'));
  }
});
