import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  modelName: 'medication',
  pageTitle: 'Medication Requests',
  searchStatus: 'Requested',

  _getStartKeyFromItem: function(item) {
    var prescriptionDateAsTime = item.get('prescriptionDateAsTime'),
      id = this._getPouchIdFromItem(item),
      requestedDateAsTime = item.get('requestedDateAsTime'),
      searchStatus = this.get('searchStatus');
    return [searchStatus, requestedDateAsTime, prescriptionDateAsTime, id];
  },

  _modelQueryParams: function() {
    var maxId = this._getMaxPouchId(),
      maxValue = this.get('maxValue'),
      minId = this._getMinPouchId(),
      searchStatus = this.get('searchStatus');
    return {
      options: {
        startkey: [searchStatus, null, null, minId],
        endkey: [searchStatus, maxValue, maxValue, maxId]
      },
      mapReduce: 'medication_by_status'
    };
  }
});
