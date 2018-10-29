import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
import { computed } from '@ember/object';

export default AbstractPagedController.extend(UserSession, {
  startKey: [],
  canAdd: computed(function() {
    return this.currentUserCan('add_medication');
  }),

  showActions: computed(function() {
    return this.currentUserCan('fulfill_medication');
  })
});
