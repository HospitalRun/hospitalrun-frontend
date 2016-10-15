import Ember from 'ember';
export default {
  sortByDate: function(firstItem, secondItem, compareAttribute) {
    let firstDate = firstItem.get(compareAttribute);
    let secondDate = secondItem.get(compareAttribute);
    return Ember.compare(firstDate.getTime(), secondDate.getTime());
  }
};
