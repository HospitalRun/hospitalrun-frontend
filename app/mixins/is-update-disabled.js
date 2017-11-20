import { isNone } from '@ember/utils';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  isUpdateDisabled: function() {
    if (!isNone(this.get('model.isValid'))) {
      return !this.get('model.isValid');
    } else {
      return false;
    }
  }.property('model.isValid')
});
