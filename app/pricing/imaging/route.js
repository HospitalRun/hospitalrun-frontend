import PricingIndexRoute from 'hospitalrun/pricing/index/route';
export default PricingIndexRoute.extend({
  category: 'Imaging',
  pageTitle: 'Imaging Pricing',

  actions: {
    editItem(item) {
      item.set('returnTo', 'pricing.imaging');
      this.transitionTo('pricing.edit', item);
    }
  }
});
