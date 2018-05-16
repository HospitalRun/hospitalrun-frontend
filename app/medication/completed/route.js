<<<<<<< HEAD
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
=======
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import MedicationIndexRoute from 'hospitalrun/medication/index/route';

export default MedicationIndexRoute.extend({
  modelName: 'medication',
  pageTitle: computed('i18n.locale', () => {
    return t('medication.titles.completedMedication');
  }),
  searchStatus: 'Fulfilled'
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
