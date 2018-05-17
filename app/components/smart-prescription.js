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
