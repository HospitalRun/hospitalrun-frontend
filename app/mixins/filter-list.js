import Ember from 'ember';

const {
  isEmpty,
  String: {
    isHTMLSafe
  }
} = Ember;

export default Ember.Mixin.create({
  filteredBy: new Ember.Map(),

  filterList(list, filterBy, filterValue) {
    let filteredBy = this.get('filteredBy');
    if (isEmpty(filterBy) && isEmpty(filteredBy)) {
      return list;
    }
    if (!isEmpty(filterBy)) {
      filteredBy.set(filterBy, filterValue);
    }
    this.set('filteredBy', filteredBy);
    let filteredList = list.filter((order) => {
      let includeRecord = true;
      filteredBy.forEach((filterValue, filterBy) => {
        let orderValue = order.get(filterBy);
        if (!isEmpty(filterValue)) {
          if (isHTMLSafe(filterValue)) {
            filterValue = filterValue.toString();
          }
          if (isHTMLSafe(orderValue)) {
            orderValue = orderValue.toString();
          }
          if (orderValue !== filterValue) {
            includeRecord = false;
          }
        }
      });
      return includeRecord;
    });
    return filteredList;
  }
});
