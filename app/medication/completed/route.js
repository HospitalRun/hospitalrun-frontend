import { computed } from '@ember/object';
import { t } from 'hospitalrun/macro';
import MedicationIndexRoute from 'hospitalrun/medication/index/route';

export default MedicationIndexRoute.extend({
  modelName: 'medication',
  pageTitle: computed('intl.locale', () => {
    return t('medication.titles.completedMedication');
  }),
  searchStatus: 'Fulfilled'
});
