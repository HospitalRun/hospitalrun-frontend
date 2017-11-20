import { once } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
  firstQuantity: false,
  quantity: null,
  quantityHelp: null,
  unitName: null,
  unit: null,
  resetUnitName: false,
  targetUnit: alias('parentView.targetUnit'),
  unitList: null,

  unitClass: function() {
    let selectedUnit = this.get('unit');
    let targetUnit = this.get('targetUnit');
    let unitClass = 'has-success';
    if (!isEmpty(targetUnit) && isEmpty(selectedUnit)) {
      this.set('unitHelp', 'please select a unit');
      unitClass = 'has-error';
    } else {
      if (isEmpty(targetUnit)) {
        unitClass = '';
      }
      this.set('unitHelp');
    }
    this.get('parentView').updateCurrentUnit(selectedUnit, this.get('index'));
    return unitClass;
  }.property('targetUnit', 'unit'),

  quantityClass: function() {
    let quantity = this.get('quantity');
    let quantityClass = 'has-success';
    let targetUnit = this.get('targetUnit');
    if (!isEmpty(targetUnit) && (isEmpty(quantity) || isNaN(quantity) || quantity < 0)) {
      this.set('quantityHelp', 'not a valid number');
      quantityClass = 'has-error';
    } else {
      if (isEmpty(targetUnit)) {
        quantityClass = '';
      }
      this.set('quantityHelp');
    }
    once(this, function() {
      this.get('parentView').calculateTotal();
    });
    return quantityClass;
  }.property('quantity', 'targetUnit')
});
