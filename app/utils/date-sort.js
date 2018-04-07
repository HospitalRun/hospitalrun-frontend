import { compare } from '@ember/utils';
export default {
  sortByDate(firstItem, secondItem, compareAttribute) {
    let firstDate = firstItem.get(compareAttribute);
    let secondDate = secondItem.get(compareAttribute);
    return compare(firstDate.getTime(), secondDate.getTime());
  }
};
