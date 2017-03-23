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
