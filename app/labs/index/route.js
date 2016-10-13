import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  modelName: 'lab',
  pageTitle: t('labs.requestsTitle'),
  searchStatus: 'Requested',

  _getStartKeyFromItem: function(item) {
    let labDateAsTime = item.get('labDateAsTime');
    let id = this._getPouchIdFromItem(item);
    let requestedDateAsTime = item.get('requestedDateAsTime');
    let searchStatus = this.get('searchStatus');
    return [searchStatus, requestedDateAsTime, labDateAsTime, id];
  },

  _modelQueryParams: function() {
    let maxId = this._getMaxPouchId();
    let maxValue = this.get('maxValue');
    let minId = this._getMinPouchId();
    let searchStatus = this.get('searchStatus');
    return {
      options: {
        startkey: [searchStatus, null, null, minId],
        endkey: [searchStatus, maxValue, maxValue, maxId]
      },
      mapReduce: 'lab_by_status'
    };
  }
});
