import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend(UserSession, {
  modelName: 'inv-request',
  newButtonAction: function() {
    if (this.currentUserCan('add_inventory_request')) {
      return 'newRequest';
    } else {
      return null;
    }
  }.property(),
  newButtonText: t('buttons.newRequestPlus'),
  pageTitle: t('navigation.subnav.requests'),

  _getStartKeyFromItem: function(item) {
    let itemId = this._getPouchIdFromItem(item);
    return ['Requested', null, itemId];
  },

  _modelQueryParams: function() {
    let maxValue = this.get('maxValue');
    return {
      options: {
        startkey: ['Requested', null, null],
        endkey: ['Requested', maxValue, maxValue]
      },
      mapReduce: 'inventory_request_by_status'
    };
  },

  actions: {
    fulfill: function(item) {
      item.set('dateCompleted', new Date());
      this.transitionTo('inventory.request', item);
    }
  }
});
