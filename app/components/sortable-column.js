import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ['sortable-column'],
  tagName: 'th',
  action: 'sortByKey',
  sortDesc: false,
  sortBy: null,
  sortKey: null,
  sorted: function() {
    let sortBy = this.get('sortBy'),
      sortKey = this.get('sortKey');
    return sortBy === sortKey;
  }.property('sortBy', 'sortKey'),

  click() {
    let sortBy = this.get('sortBy'),
      sorted = this.get('sorted'),
      sortDesc = false;
    if (sorted) {
      sortDesc = this.toggleProperty('sortDesc');
    }
    this.sendAction('action', sortBy, sortDesc);
  }
});
