import Ember from 'ember';
export default Ember.TextField.extend(Ember.TargetActionSupport, {
  change: function() {
    this.triggerAction({
      action: 'search'
    });
  },
  didInsertElement: function() {
    this.$().focus();
  }
});
