import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ['sortable-column'],
  tagName: 'th',
  action: 'sortByKey',
  descending: false,
  sortBy: null,
  sortKey: null,
  sorted: function() {
    let sortBy = this.get('sortBy');
    let sortKey = this.get('sortKey');
    return sortBy === sortKey;
  }.property('sortBy', 'sortKey'),

  click() {
    let sortBy = this.get('sortBy');
    let sorted = this.get('sorted');
    let descending = false;
    if (sorted) {
      descending = this.toggleProperty('descending');
    }
    this.sendAction('action', sortBy, descending);
  }
});
