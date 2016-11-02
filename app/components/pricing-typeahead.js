import Ember from 'ember';
import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend({
  displayKey: 'name',
  setOnBlur: true,

  _mapContentItems: function() {
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
