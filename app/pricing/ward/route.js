import PricingIndexRoute from 'hospitalrun/pricing/index/route';
export default PricingIndexRoute.extend({
  category: 'Ward',
  pageTitle: 'Ward Pricing',

  actions: {
    editItem(item) {
      item.set('returnTo', 'pricing.ward');
      this.transitionTo('pricing.edit', item);
    }
  }
});
