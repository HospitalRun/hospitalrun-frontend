import PricingIndexRoute from 'hospitalrun/pricing/index/route';
export default PricingIndexRoute.extend({
  category: 'Lab',
  pageTitle: 'Lab Pricing',

  actions: {
    editItem: function(item) {
      item.set('returnTo', 'pricing.lab');
      this.transitionTo('pricing.edit', item);
    }
  }
});
