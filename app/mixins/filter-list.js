import Ember from 'ember';

const {
  compare,
  get,
  isEmpty,
  String: {
    isHTMLSafe
  },
  set
} = Ember;

export default Ember.Mixin.create({
  filterBy: null,
  filterValue: null,
  filteredBy: new Ember.Map(),
  sortByDesc: null,
  sortByKey: null,

  filterList(list, filterBy, filterValue) {
    let filteredBy = get(this, 'filteredBy');
    if (isEmpty(filterBy) && isEmpty(filteredBy)) {
      return list;
    }
    if (!isEmpty(filterBy)) {
      filteredBy.set(filterBy, filterValue);
    }
    this.set('filteredBy', filteredBy);
    let filteredList = list.filter((listItem) => {
      let includeRecord = true;
      filteredBy.forEach((filterValue, filterBy) => {
        let itemValue = listItem.get(filterBy);
        if (!isEmpty(filterValue)) {
          if (isHTMLSafe(filterValue)) {
            filterValue = filterValue.toString();
          } else if (filterValue instanceof Date) {
            filterValue = filterValue.getTime();
          }
          if (isHTMLSafe(itemValue)) {
            itemValue = itemValue.toString();
          } else if (itemValue instanceof Date) {
            itemValue = itemValue.getTime();
          }
          if (itemValue !== filterValue) {
            includeRecord = false;
          }
        }
      });
      return includeRecord;
    });
    return filteredList;
  },

  sortFilteredList(filteredList) {
    let sortDesc = get(this, 'sortByDesc');
    let sortBy = get(this, 'sortByKey');
    if (isEmpty(filteredList) || isEmpty(sortBy)) {
      return filteredList;
    }
    filteredList = filteredList.toArray().sort(function(a, b) {
      let compareA = a.get(sortBy);
      let compareB = b.get(sortBy);
      if (sortBy === 'orderType') {
        compareA = compareA.toString();
        compareB = compareB.toString();
      }
      if (sortDesc) {
        return compare(compareB, compareA);
      } else {
        return compare(compareA, compareB);
      }
    });
    return filteredList;
  },

  actions: {
    filter(filterBy, filterValue) {
      set(this, 'filterBy', filterBy);
      set(this, 'filterValue', filterValue);
    },

    sortByKey(sortKey, sortDesc) {
      this.setProperties({
        sortByDesc: sortDesc,
        sortByKey: sortKey
      });
    }
  }
});
