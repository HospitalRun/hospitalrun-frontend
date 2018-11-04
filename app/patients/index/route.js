import { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { t } from 'hospitalrun/macro';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractIndexRoute.extend(UserSession, {
  modelName: 'patient',
  newButtonAction: computed(function() {
    if (this.currentUserCan('add_patient')) {
      return 'newItem';
    } else {
      return null;
    }
  }),
  newButtonText: t('patients.buttons.newPatient'),
  pageTitle: computed('intl.locale', () => {
    return t('patients.titles.patientListing');
  }),

  _getStartKeyFromItem(item) {
    let displayPatientId = item.get('displayPatientId');
    let id = this._getPouchIdFromItem(item);
    return [displayPatientId, id];
  },

  _modelQueryParams() {
    return {
      mapReduce: 'patient_by_display_id'
    };
  }

});
