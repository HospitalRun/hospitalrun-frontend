import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ['sortable-column'],
  tagName: 'th',
  action: 'sortByKey',
  filterAction: 'filter',
  filterBy: null,
  filteredBy: null,
  filterType: 'list',
  sortDesc: false,
  sortBy: null,
  sortKey: null,
  filtered: false,

  sorted: function() {
    let sortBy = this.get('sortBy');
    let sortKey = this.get('sortKey');
    return sortBy === sortKey;
  }.property('sortBy', 'sortKey'),

  actions: {
    sort() {
      let sortBy = this.get('sortBy');
      let sorted = this.get('sorted');
      let sortDesc = false;
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
