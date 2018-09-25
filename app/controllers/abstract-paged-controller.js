import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Controller from '@ember/controller';
import PaginationProps from 'hospitalrun/mixins/pagination-props';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import UserSession from 'hospitalrun/mixins/user-session';
export default Controller.extend(PaginationProps, ProgressDialog, UserSession, {
  addPermission: null,
  deletePermission: null,
  nextStartKey: null,
  previousStartKey: null,
  previousStartKeys: [],
  progressMessage: 'Loading Records.  Please wait...',
  progressTitle: 'Loading',
  queryParams: ['startKey', 'sortKey', 'sortDesc'],
  sortDesc: false,
  sortKey: null,

  canAdd: computed(function() {
    return this.currentUserCan(this.get('addPermission'));
  }),

  canDelete: computed(function() {
    return this.currentUserCan(this.get('deletePermission'));
  }),

  canEdit: computed(function() {
    // Default to using add permission
    return this.currentUserCan(this.get('addPermission'));
  }),

  showActions: computed('canAdd', 'canEdit', 'canDelete', function() {
    return (this.get('canAdd') || this.get('canEdit') || this.get('canDelete'));
  }),

  disablePreviousPage: computed('previousStartKey', function() {
    return isEmpty(this.get('previousStartKey'));
  }),

  disableNextPage: computed('nextStartKey', function() {
    return isEmpty(this.get('nextStartKey'));
  }),

  showPagination: computed('nextStartKey', 'previousStartKey', function() {
    return !isEmpty(this.get('previousStartKey')) || !isEmpty(this.get('nextStartKey'));
  }),

  hasRecords: computed('model.length', {
    get() {
      let model = this.get('model');
      if (!isEmpty(model)) {
        return (model.get('length') > 0);
      } else {
        return false;
      }
    }
  }),

  actions: {
    nextPage() {
      let key = this.get('nextStartKey');
      let previousStartKeys = this.get('previousStartKeys');
      let firstKey = this.get('firstKey');
      this.set('previousStartKey', firstKey);
      previousStartKeys.push(firstKey);
      this.set('startKey', key);
      this.showProgressModal();
    },
    previousPage() {
      let key = this.get('previousStartKey');
      let previousStartKeys = this.get('previousStartKeys');
      previousStartKeys.pop();
      this.set('startKey', key);
      this.set('previousStartKey', previousStartKeys.pop());
      this.set('previousStartKeys', previousStartKeys);
      this.showProgressModal();
    },
    sortByKey(sortKey, sortDesc) {
      this.setProperties({
        previousStartKey: null,
        previousStartKeys: [],
        nextStartKey: null,
        sortDesc,
        sortKey,
        startKey: null,
        firstKey: null
      });
      this.showProgressModal();
    }
  }
});
