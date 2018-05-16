<<<<<<< HEAD
import Ember from 'ember';
export default {
  sortByDate(firstItem, secondItem, compareAttribute) {
    let firstDate = firstItem.get(compareAttribute);
    let secondDate = secondItem.get(compareAttribute);
    return Ember.compare(firstDate.getTime(), secondDate.getTime());
  }
};
=======
import { compare } from '@ember/utils';
export default {
  sortByDate(firstItem, secondItem, compareAttribute) {
    let firstDate = firstItem.get(compareAttribute);
    let secondDate = secondItem.get(compareAttribute);
    return compare(firstDate.getTime(), secondDate.getTime());
  }
};
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
