import Ember from 'ember';
export default Ember.Mixin.create({
  filteredBy: new Ember.Map(),

  filterList(list, filterBy, filterValue) {
    if (Ember.isEmpty(filterBy)) {
      return list;
    }
    let filteredBy = this.get('filteredBy');
    filteredBy.set(filterBy, filterValue);
    this.set('filteredBy', filteredBy);
    let filteredList = list.filter((order) => {
      let includeRecord = true;
      filteredBy.forEach((filterValue, filterBy) => {
        let orderValue = order.get(filterBy);
        if (!Ember.isEmpty(filterValue)) {
          if (Ember.String.isHTMLSafe(filterValue)) {
            filterValue = filterValue.toString();
          }
          if (Ember.String.isHTMLSafe(orderValue)) {
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
