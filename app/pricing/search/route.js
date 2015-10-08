import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import PricingSearch from 'hospitalrun/utils/pricing-search';
export default AbstractSearchRoute.extend({
  moduleName: 'pricing',
  searchKeys: [
    'name'
  ],
  searchIndex: PricingSearch,
  searchModel: 'pricing'
});
