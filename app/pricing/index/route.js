import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractIndexRoute.extend(UserSession, {
  category: null,
  modelName: 'pricing',
  pageTitle: 'All Pricing Items',

  _getStartKeyFromItem: function(item) {
    let category = item.get('category'),
      id = this._getPouchIdFromItem(item),
      name = item.get('name'),
      pricingType = item.get('pricingType');
    return [category, name, pricingType, id];
  },

  _modelQueryParams: function() {
    let category = this.get('category'),
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
  },

  actions: {
    newItem: function() {
      if (this.currentUserCan('add_pricing')) {
        let routeId = 'new',
          routeParts = this.routeName.split('.');
        if (routeParts.length === 2 && routeParts[1] !== 'index') {
          routeId += routeParts[1].capitalize();
        }
        this.transitionTo('pricing.edit', routeId);
      }
    }
  }
});
