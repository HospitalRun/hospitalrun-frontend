<<<<<<< HEAD
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
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
