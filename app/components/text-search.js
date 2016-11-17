import Ember from 'ember';
export default Ember.TextField.extend(Ember.TargetActionSupport, {
  change() {
    this.triggerAction({
      action: 'search'
    });
  },
  didInsertElement() {
    this.$().focus();
  }
});
