import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import moment from 'moment';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import { translationMacro as t } from 'ember-intl';

export default AbstractEditRoute.extend(AddToPatientRoute, ChargeRoute, PatientListRoute, {
  editTitle: t('labs.editTitle'),
  modelName: 'lab',
  newTitle: t('labs.newTitle'),
  pricingCategory: 'Lab',
  customForms: service(),

  actions: {
    returnToAllItems() {
      this.controller.send('returnToAllItems');
    },

    allItems() {
      if (this.controller.get('isCompleted')) {
        this.transitionTo('labs.completed');
      } else {
        this.transitionTo('labs.index');
      }
    }
  },

  getNewData() {
    let newLabData = {
      selectPatient: true,
      requestDate: moment().startOf('day').toDate(),
      customForms: EmberObject.create()
    };
    let customForms = this.get('customForms');
    return customForms.setDefaultCustomForms(['lab'], newLabData);
  }
});
