import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  modelName: 'patient',
  pageTitle: 'Admitted patients',

  _getStartKeyFromItem: function(item) {
    var displayPatientId = item.get('displayPatientId');
    return [displayPatientId, 'patient_' + item.get('id')];
  },

  _modelQueryParams: function() {
    return {
      options: {
        key: true
      },
      mapReduce: 'patient_by_admission'
    };
  }
});
