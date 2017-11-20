import { resolve } from 'rsvp';
import { translationMacro as t } from 'ember-i18n';
import MedicationEditRoute from '../edit/route';

export default MedicationEditRoute.extend({
  editTitle: t('medication.returnMedication'),
  modelName: 'inv-request',
  newTitle: t('medication.returnMedication'),
  getNewData() {
    return resolve({
      dateCompleted: new Date(),
      selectPatient: true,
      transactionType: 'Return'
    });
  }
});
