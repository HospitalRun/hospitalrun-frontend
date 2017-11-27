import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

// const { get } = Ember;
// let i18n = get(this, 'i18n');

export default Ember.Mixin.create({
  Schools: [
    'Axular',
    'Larrabetxu',
    'Zamudio',
    'NeureClinic'
    /*
    i18n.t('mixins.schools.Axular'),
    i18n.t('mixins.schools.Larrabetxu'),
    i18n.t('mixins.schools.Zamudio'),
    i18n.t('mixins.schools.NeureClinic')*/
  ].map(SelectValues.selectValuesMap)
});
