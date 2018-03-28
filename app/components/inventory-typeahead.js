import { once } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend({
  classNameBindings: ['haveInventoryItems'],
  displayKey: 'name',
  showQuantity: true,
  i18n: service(),
  store: service(),

  _mapInventoryItems(item) {
    let returnObj = {};
    if (this.get('showQuantity') && item.quantity) {
      returnObj.name = `${item.name} - ${item.friendlyId} (${this.get('i18n').t(
        'inventory.labels.availableQuantity',
        { quantity: item.quantity }
      )})`;
    } else {
      returnObj.name = `${item.name} - ${item.friendlyId}`;
    }
    returnObj[this.get('selectionKey')] = item;
    return returnObj;
  },

  haveInventoryItems: function() {
    let content = this.get('content');
    if (!isEmpty(content) && content.length > 0) {
      return 'have-inventory-items';
    }
  }.property('content'),

  mappedContent: function() {
    let content = this.get('content');
    let mapped = [];
    if (content) {
      mapped = content.map(this._mapInventoryItems.bind(this));
    }
    return mapped;
  }.property('content'),

  contentChanged: function() {
    let bloodhound = this.get('bloodhound');
    let content = this.get('content');
    if (bloodhound) {
      bloodhound.clear();
      bloodhound.add(content.map(this._mapInventoryItems.bind(this)));
    }
  }.observes('content.[]'),

  itemSelected(selectedInventoryItem) {
    this._super();
    let store = this.get('store');
    if (!isEmpty(selectedInventoryItem)) {
      store.find('inventory', selectedInventoryItem.id).then((inventoryItem) => {
        let model = this.get('model');
        model.set('inventoryItem', inventoryItem);
        once(this, function() {
          model.validate().catch(function() {});
        });
      });
    }
  }
});
