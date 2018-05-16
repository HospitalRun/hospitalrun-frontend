<<<<<<< HEAD
import Ember from 'ember';
import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend({
  displayKey: 'name',
  setOnBlur: true,

  _mapContentItems() {
    let content = this.get('content');
    if (content) {
      let mapped = content.filter(function(item) {
        return !Ember.isEmpty(item);
      });
      mapped = mapped.map(function(item) {
        let returnObj = {};
        returnObj.name = item.name;
        returnObj[this.get('selectionKey')] = item;
        return returnObj;
      }.bind(this));
      return mapped;
    } else {
      return [];
    }
  }
});
=======
import { isEmpty } from '@ember/utils';
import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend({
  displayKey: 'name',
  setOnBlur: true,

  _mapContentItems() {
    let content = this.get('content');
    if (content) {
      let mapped = content.filter(function(item) {
        return !isEmpty(item);
      });
      mapped = mapped.map(function(item) {
        let returnObj = {};
        returnObj.name = item.name;
        returnObj[this.get('selectionKey')] = item;
        return returnObj;
      }.bind(this));
      return mapped;
    } else {
      return [];
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
