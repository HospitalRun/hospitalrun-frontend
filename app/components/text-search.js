import TextField from '@ember/component/text-field';
import Ember from 'ember';
export default TextField.extend(Ember.TargetActionSupport, {
  change() {
    this.triggerAction({
      action: 'search'
    });
  },
  didInsertElement() {
    this.$().focus();
  }
});
