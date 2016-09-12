import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  modelName: 'visit',
  newButtonAction: 'patientCheckIn',
  newButtonText: t('patients.buttons.patientCheckIn'),
  pageTitle: t('patients.titles.todaysOutpatients'),

  _getStartKeyFromItem: function(item) {
    var displayPatientId = item.get('displayPatientId');
    return [displayPatientId, 'patient_' + item.get('id')];
  },

  _modelQueryParams: function() {
    var endOfDay = moment().endOf('day').valueOf();
    var startOfDay = moment().startOf('day').valueOf();
    return {
      mapReduce: 'visit_by_date',
      options: {
        endkey: [endOfDay, endOfDay, this._getMaxPouchId()],
        startkey: [startOfDay, null, this._getMinPouchId()]
      }
    };
  },

  actions: {
    patientCheckIn: function() {
      this.controller.send('patientCheckIn');
    }
  }

});
