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
  filtered: Ember.computed('filteredBy', 'filterBy', function() {
    let filterBy = this.get('filterBy');
    let filteredBy = this.get('filteredBy');
    if (filteredBy && filteredBy[filterBy]) {
      return true;
    }
  }),
  sorted: function() {
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
  },

  actions: {
    filter(filterValue) {
      let filterBy = this.get('filterBy');
      let $dropdown = this.$('.dropdown-toggle');
      $dropdown.dropdown('toggle');
      this.sendAction('filterAction', filterBy, filterValue);

    }
  }
});
