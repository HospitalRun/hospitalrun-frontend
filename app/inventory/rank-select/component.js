<<<<<<< HEAD
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
import computed from 'ember-computed';
export default Ember.Component.extend({
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
=======
import { A } from '@ember/array';
import Component from '@ember/component';
import SelectValues from 'hospitalrun/utils/select-values';
import computed from 'ember-computed';
export default Component.extend({
  rankOptions: [],
  prompt: ' ',
  class: 'col-sm-2 test-inv-rank',

  options: computed('rankOptions', function() {
    return SelectValues.selectValues(this.get('rankOptions'));
  }),

  init() {
    this._super(...arguments);

    // set available options
    this.set('rankOptions', A(['A', 'B', 'C']));
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
