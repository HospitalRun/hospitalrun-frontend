import Ember from 'ember';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
export default Ember.Component.extend(ChargeActions, {
  attributeBindings: ['tabId:id', 'role',],
  charges: null,
  classNameBindings: ['active'],
  classNames: ['tab-pane'],
  index: null,
  pricingList: null,
  pricingType: null,
  role: 'tab',
  setChargeQuantityAction: 'setChargeQuantity',

  active: function () {
    var index = this.get('index');
    return (index === 0);
  }.property(),

  pricingListByType: function () {
    var pricingList = this.get('pricingList'),
      pricingType = this.get('pricingType'),
      rows = [];
    if (!Ember.isEmpty(pricingList)) {
      pricingList = pricingList.filterBy('pricingType', pricingType);
      pricingList = pricingList.map(function (pricingItem) {
        var chargesForItem = this.findChargeForPricingItem(pricingItem);
        if (chargesForItem) {
          this.sendAction('setChargeQuantityAction', pricingItem.id, chargesForItem.get('quantity'));
        }
        return pricingItem;
      }.bind(this));
      var offset = 0,
        length = pricingList.length;
      while (offset < length) {
        rows.push(pricingList.slice(offset, offset + 6));
        offset += 6;
      }

    }
    return rows;
  }.property('pricingType', 'pricingList'),

  tabId: function () {
    return this.get('pricingType').toLowerCase().dasherize();
  }.property('pricingType')

});
