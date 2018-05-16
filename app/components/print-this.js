<<<<<<< HEAD
import Ember from 'ember';

const {
  get,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  print: true,
  delay: null,

  didInsertElement() {
    if (get(this, 'print')) {
      let delay = get(this, 'delay');
      if (!isEmpty(delay) && !isNaN(delay) && delay > 0) {
        Ember.run.later(null, function() {
          window.print();
        }, delay);
      } else {
        Ember.run.scheduleOnce('afterRender', this, function() {
          window.print();
        });
      }
    }
  }
});
=======
import { later, scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  print: true,
  delay: null,

  didInsertElement() {
    if (get(this, 'print')) {
      let delay = get(this, 'delay');
      if (!isEmpty(delay) && !isNaN(delay) && delay > 0) {
        later(null, function() {
          window.print();
        }, delay);
      } else {
        scheduleOnce('afterRender', this, function() {
          window.print();
        });
      }
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
