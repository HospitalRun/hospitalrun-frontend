import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  modelName: 'patient',
  pageTitle: t('patients.titles.patientListing'),

  _getStartKeyFromItem: function(item) {
    var displayPatientId = item.get('displayPatientId');
    var id = this._getPouchIdFromItem(item);
    return [displayPatientId, id];
  },

  _modelQueryParams: function() {
    return {
      mapReduce: 'patient_by_display_id'
    };
  }

});
