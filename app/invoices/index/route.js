import { isEmpty } from '@ember/utils';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  modelName: 'invoice',
  pageTitle: 'Invoice Listing',

  _getStartKeyFromItem(item) {
    let billDateAsTime = item.get('billDateAsTime');
    let id = this._getPouchIdFromItem(item);
    let searchStatus = item.get('status');
    return [searchStatus, billDateAsTime, id];
  },

  _modelQueryParams(params) {
    let queryParams;
    let maxId = this._getMaxPouchId();
    let maxValue = this.get('maxValue');
    let minId = this._getMinPouchId();
    let searchStatus = params.status;
    if (isEmpty(searchStatus)) {
      searchStatus = 'Billed';
    }

    this.set('pageTitle', `${searchStatus} Invoices`);
    queryParams = {
      options: {
        startkey: [searchStatus, null, minId],
        endkey: [searchStatus, maxValue, maxId]
      },
      mapReduce: 'invoice_by_status'
    };

    if (searchStatus === 'All') {
      delete queryParams.options.startkey;
      delete queryParams.options.endkey;
    }
    return queryParams;

  },

  queryParams: {
    startKey: { refreshModel: true },
    status: { refreshModel: true }
  }
});
