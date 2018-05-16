<<<<<<< HEAD
import Ember from 'ember';
export default Ember.TextArea.extend(Ember.TargetActionSupport, {
  valueDidChange: Ember.observer('value', function() {
    this.triggerAction({
      action: 'search'
    });
  })
});
=======
import { observer } from '@ember/object';
import TextArea from '@ember/component/text-area';
import Ember from 'ember';
export default TextArea.extend(Ember.TargetActionSupport, {
  valueDidChange: observer('value', function() {
    this.triggerAction({
      action: 'search'
    });
  })
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
