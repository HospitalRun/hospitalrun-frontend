import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
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

  sorted: computed('sortBy', 'sortKey', function() {
    let sortBy = this.get('sortBy');
    let sortKey = this.get('sortKey');
    return sortBy === sortKey;
  }),

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
      if (isEmpty(filterValue)) {
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
