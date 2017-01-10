import Ember from 'ember';
export default Ember.Component.extend({
  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      window.print();
    });
  }
});
