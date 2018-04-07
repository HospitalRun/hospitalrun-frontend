import { isEmpty } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  actions: {
    dateSetActionWrapper(newDate) {
      if (!isEmpty(this.get('dateSetAction'))) {
        this.sendAction('dateSetAction', newDate);
      }
    }
  }
});
