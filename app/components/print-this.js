import Ember from 'ember';
export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      window.print();
    });
  }
});
