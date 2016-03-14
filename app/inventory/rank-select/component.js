import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
import computed from 'ember-computed';
import { translationMacro as t } from 'ember-i18n';
export default Ember.Component.extend({
  label: t('inventory.labels.rank'),
  rankOptions: [],
  prompt: ' ',
  class: 'col-sm-2 test-inv-rank',

  options: computed('rankOptions', function() {
    return SelectValues.selectValues(this.get('rankOptions'));
  }),

  init() {
    this._super(...arguments);

    // set available options
    this.set('rankOptions', Ember.A(['A', 'B', 'C']));
  }
});
