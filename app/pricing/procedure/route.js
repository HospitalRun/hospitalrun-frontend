import PricingIndexRoute from 'hospitalrun/pricing/index/route';
export default PricingIndexRoute.extend({
  category: 'Procedure',
  pageTitle: 'Procedure Pricing',

  actions: {
    editItem(item) {
      item.set('returnTo', 'pricing.procedure');
      this.transitionTo('pricing.edit', item);
    }
  }
});
