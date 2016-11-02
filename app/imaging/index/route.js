import { translationMacro as t } from 'ember-i18n';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  modelName: 'imaging',
  pageTitle: t('imaging.pageTitle'),
  searchStatus: 'Requested',

  _getStartKeyFromItem: function(item) {
    let imagingDateAsTime = item.get('imagingDateAsTime');
    let id = this._getPouchIdFromItem(item);
    let requestedDateAsTime = item.get('requestedDateAsTime');
    let searchStatus = this.get('searchStatus');
    return [searchStatus, requestedDateAsTime, imagingDateAsTime, id];
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
      mapReduce: 'imaging_by_status'
    };
  }
});
