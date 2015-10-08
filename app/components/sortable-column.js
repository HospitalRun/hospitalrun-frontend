import Ember from 'ember';
export default Ember.Component.extend({
  tagName: 'th',
  action: 'sortByKey',
  sortDesc: false,
  sortBy: null,
  sortKey: null,
  sorted: function () {
    var sortBy = this.get('sortBy'),
      sortKey = this.get('sortKey');
    return sortBy === sortKey;
  }.property('sortBy', 'sortKey'),

  click() {
    var sortBy = this.get('sortBy'),
      sorted = this.get('sorted'),
      sortDesc = false;
    if (sorted) {
      sortDesc = this.toggleProperty('sortDesc');
    }
    this.sendAction('action', sortBy, sortDesc);
  }
});
