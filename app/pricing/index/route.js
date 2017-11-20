import { isEmpty } from '@ember/utils';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractIndexRoute.extend(UserSession, {
  category: null,
  modelName: 'pricing',
  pageTitle: 'All Pricing Items',

  _getStartKeyFromItem(item) {
    let category = item.get('category');
    let id = this._getPouchIdFromItem(item);
    let name = item.get('name');
    let pricingType = item.get('pricingType');
    return [category, name, pricingType, id];
  },

  _modelQueryParams() {
    let category = this.get('category');
    let maxId = this._getMaxPouchId();
    let queryParams = {
      mapReduce: 'pricing_by_category'
    };
    if (!isEmpty(category)) {
      queryParams.options = {
        startkey: [category, null, null, null],
        endkey: [category, {}, {}, maxId]
      };
    }
    return queryParams;
  },

  actions: {
    newItem() {
      if (this.currentUserCan('add_pricing')) {
        let routeId = 'new';
        let routeParts = this.routeName.split('.');
        if (routeParts.length === 2 && routeParts[1] !== 'index') {
          routeId += routeParts[1].capitalize();
        }
        this.transitionTo('pricing.edit', routeId);
      }
    }
  }
});
