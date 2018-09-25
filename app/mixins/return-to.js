import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  cancelAction: computed('returnTo', function() {
    let returnTo = this.get('model.returnTo');
    if (isEmpty(returnTo)) {
      return 'allItems';
    } else {
      return 'returnTo';
    }
  })
});
