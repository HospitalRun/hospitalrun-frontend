import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
export default Component.extend(ChargeActions, {
  attributeBindings: ['tabId:id', 'role'],
  charges: alias('model.charges'),
  classNameBindings: ['active'],
  classNames: ['tab-pane'],
  index: null,
  model: null,
  pricingList: null,
  pricingType: null,
  role: 'tab',
  setChargeQuantityAction: 'setChargeQuantity',

  active: function() {
    let index = this.get('index');
    return (index === 0);
  }.property(),

  pricingListByType: function() {
    let pricingList = this.get('pricingList');
    let pricingType = this.get('pricingType');
    let rows = [];
    if (!isEmpty(pricingList)) {
      pricingList = pricingList.filterBy('pricingType', pricingType);
      pricingList = pricingList.map(function(pricingItem) {
        let chargesForItem = this.findChargeForPricingItem(pricingItem, this.get('charges'));
        if (chargesForItem) {
          this.sendAction('setChargeQuantityAction', pricingItem.id, chargesForItem.get('quantity'));
        }
        return pricingItem;
      }.bind(this));
      let offset = 0;
      let { length } = pricingList;
      while (offset < length) {
        rows.push(pricingList.slice(offset, offset + 6));
        offset += 6;
      }

    }
    return rows;
  }.property('pricingType', 'pricingList'),

  tabId: function() {
    return this.get('pricingType').toLowerCase().dasherize();
  }.property('pricingType')

});
