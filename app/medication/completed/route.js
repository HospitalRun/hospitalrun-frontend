import { translationMacro as t } from 'ember-i18n';
import MedicationIndexRoute from 'hospitalrun/medication/index/route';
import Ember from 'ember';

const { computed } = Ember;

export default MedicationIndexRoute.extend({
  modelName: 'medication',
  pageTitle: computed('i18n.locale', () => {
    return t('medication.titles.completedMedication');
  }),
  searchStatus: 'Fulfilled'
});
