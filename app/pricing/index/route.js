import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({
  category: null,
  modelName: 'pricing',
  pageTitle: 'All Pricing Items',

  _getStartKeyFromItem: function (item) {
    var category = item.get('category'),
      id = this._getPouchIdFromItem(item),
      name = item.get('name'),
      pricingType = item.get('pricingType');
    return [category, name, pricingType, id];
  },

  _modelQueryParams: function () {
    var category = this.get('category'),
      maxId = this._getMaxPouchId(),
      queryParams = {
        mapReduce: 'pricing_by_category'
      };
    if (!Ember.isEmpty(category)) {
      queryParams.options = {
        startkey: [category, null, null, null],
        endkey: [category, {}, {}, maxId]
      };
    }
    return queryParams;
  }
});
