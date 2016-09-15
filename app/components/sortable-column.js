import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ['sortable-column'],
  tagName: 'th',
  action: 'sortByKey',
  filterAction: 'filter',
  filterBy: null,
  filteredBy: null,
  sortDesc: false,
  sortBy: null,
  sortKey: null,
  filtered: false,

  sorted: function() {
    var sortBy = this.get('sortBy'),
      sortKey = this.get('sortKey');
    return sortBy === sortKey;
  }.property('sortBy', 'sortKey'),

  actions: {
    sort() {
      var sortBy = this.get('sortBy'),
        sorted = this.get('sorted'),
        sortDesc = false;
      if (sorted) {
        sortDesc = this.toggleProperty('sortDesc');
      }
      this.sendAction('action', sortBy, sortDesc);
    },

    filter(filterValue) {
      if (Ember.isEmpty(filterValue)) {
        this.set('filtered');
      } else {
        this.set('filtered', true);
      }
      let filterBy = this.get('filterBy');
      let $dropdown = this.$('.dropdown-toggle');
      $dropdown.dropdown('toggle');
      this.sendAction('filterAction', filterBy, filterValue);

    }
  }
});
