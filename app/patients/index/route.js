import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  modelName: 'patient',
  pageTitle: t('patients.titles.patient_listing'),

  _getStartKeyFromItem: function(item) {
    var displayPatientId = item.get('displayPatientId');
    return [displayPatientId, 'patient_' + item.get('id')];
  },

  _modelQueryParams: function() {
    return {
      mapReduce: 'patient_by_display_id'
    };
  }

});
