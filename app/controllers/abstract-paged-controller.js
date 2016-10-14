import Ember from 'ember';
import PaginationProps from 'hospitalrun/mixins/pagination-props';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Controller.extend(PaginationProps, ProgressDialog, UserSession, {
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

  canAdd: function() {
    return this.currentUserCan(this.get('addPermission'));
  }.property(),

  canDelete: function() {
    return this.currentUserCan(this.get('deletePermission'));
  }.property(),

  canEdit: function() {
    // Default to using add permission
    return this.currentUserCan(this.get('addPermission'));
  }.property(),

  showActions: function() {
    return (this.get('canAdd') || this.get('canEdit') || this.get('canDelete'));
  }.property('canAdd', 'canEdit', 'canDelete'),

  disablePreviousPage: function() {
    return (Ember.isEmpty(this.get('previousStartKey')));
  }.property('previousStartKey'),

  disableNextPage: function() {
    return (Ember.isEmpty(this.get('nextStartKey')));
  }.property('nextStartKey'),

  showPagination: function() {
    return (!Ember.isEmpty(this.get('previousStartKey')) || !Ember.isEmpty(this.get('nextStartKey')));
  }.property('nextStartKey', 'previousStartKey'),

  hasRecords: Ember.computed('model.length', {
    get() {
      let model = this.get('model');
      if (!Ember.isEmpty(model)) {
        return (model.get('length') > 0);
      } else {
        return false;
      }
    }
  }),

  actions: {
    nextPage: function() {
      let key = this.get('nextStartKey');
      let previousStartKeys = this.get('previousStartKeys');
      let firstKey = this.get('firstKey');
      this.set('previousStartKey', firstKey);
      previousStartKeys.push(firstKey);
      this.set('startKey', key);
      this.showProgressModal();
    },
    previousPage: function() {
      let key = this.get('previousStartKey');
      let previousStartKeys = this.get('previousStartKeys');
      previousStartKeys.pop();
      this.set('startKey', key);
      this.set('previousStartKey', previousStartKeys.pop());
      this.set('previousStartKeys', previousStartKeys);
      this.showProgressModal();
    },
    sortByKey: function(sortKey, sortDesc) {
      this.setProperties({
        previousStartKey: null,
        previousStartKeys: [],
        sortDesc: sortDesc,
        sortKey: sortKey,
        startKey: null
      });
      this.showProgressModal();
    }
  }
});
