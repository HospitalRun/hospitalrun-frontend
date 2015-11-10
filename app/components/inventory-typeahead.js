import Ember from 'ember';
import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend({
  classNameBindings: ['haveInventoryItems'],
  displayKey: 'name',
  showQuantity: true,
  _mapInventoryItems: function(item) {
    var returnObj = {};
    if (this.get('showQuantity') && item.quantity) {
      returnObj.name = '%@ - %@ (%@ available)'.fmt(item.name, item.friendlyId, item.quantity);
    } else {
      returnObj.name = '%@ - %@'.fmt(item.name, item.friendlyId);
    }
    returnObj[this.get('selectionKey')] = item;
    return returnObj;
  },

  haveInventoryItems: function() {
    var content = this.get('content');
    if (!Ember.isEmpty(content) && content.length > 0) {
      return 'have-inventory-items';
    }
  }.property('content'),

  mappedContent: function() {
    var content = this.get('content'),
      mapped = [];
    if (content) {
      mapped = content.map(this._mapInventoryItems.bind(this));
    }
    return mapped;
  }.property('content'),

  contentChanged: function() {
    var bloodhound = this.get('bloodhound'),
      content = this.get('content');
    if (bloodhound) {
      bloodhound.clear();
      bloodhound.add(content.map(this._mapInventoryItems.bind(this)));
    }
  }.observes('content.[]')
});
