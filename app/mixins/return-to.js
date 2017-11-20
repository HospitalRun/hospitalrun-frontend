import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (isEmpty(returnTo)) {
      return 'allItems';
    } else {
      return 'returnTo';
    }
  }.property('returnTo')
});
