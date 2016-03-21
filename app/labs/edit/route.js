import Ember from 'ember';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
  editTitle: t('labs.edit_title'),
  modelName: 'lab',
  newTitle: t('labs.new_title'),
  pricingCategory: 'Lab',

  getNewData: function() {
    return Ember.RSVP.resolve({
      selectPatient: true,
      requestDate: moment().startOf('day').toDate()
    });
  }
});
