import { once } from '@ember/runloop';
import { set } from '@ember/object';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';

export default Component.extend({
  quantityGroups: [],
  calculated: null,
  currentUnit: null,
  targetUnit: null,
  unitList: null,

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    let quantityGroups = this.get('quantityGroups');
    if (isEmpty(quantityGroups)) {
      let calculated = this.get('calculated');
      let targetUnit = this.get('targetUnit');
      quantityGroups.addObject({
        index: 0,
        unit: targetUnit,
        firstQuantity: true,
        quantity: calculated
      });
    }
  },

  showTotal: computed('calculated', function() {
    let calculated = this.get('calculated');
    let quantityGroups = this.get('quantityGroups');
    if (quantityGroups.length > 1 && !isEmpty(calculated) && !isNaN(calculated)) {
      return true;
    }
    return false;
  }),

  currentQuantityGroups: computed('quantityGroups', 'targetUnit', function() {
    let firstQuantityObject;
    let quantityGroups = this.get('quantityGroups');
    let targetUnit = this.get('targetUnit');
    firstQuantityObject = quantityGroups.get('firstObject');
    if (!isEmpty(firstQuantityObject)) {
      let selectedUnit = firstQuantityObject.unit;
      if (isEmpty(selectedUnit)) {
        this.set('quantityGroups.firstObject.unit', targetUnit);
      } else {
        this.updateCurrentUnit(selectedUnit, 0);
      }
    }
    return quantityGroups;
  }),

  calculateTotal() {
    let quantityGroups = this.get('quantityGroups');
    let haveQuantities = false;
    let lastObject = quantityGroups.get('lastObject');
    let targetUnit = this.get('targetUnit');
    haveQuantities = quantityGroups.every(function(item) {
      let { quantity, unit } = item;
      return !isEmpty(quantity) && !isEmpty(unit) && !isNaN(quantity);
    });
    if (haveQuantities && lastObject.unit === targetUnit) {
      let newValue = quantityGroups.reduce(function(previousValue, item) {
        return previousValue * parseInt(item.quantity);
      }, 1);
      this.set('calculated', newValue);
    } else {
      this.set('calculated');
    }
  },

  updateCurrentUnit(selectedUnit, index) {
    let targetUnit = this.get('targetUnit');
    let quantityGroups = this.get('quantityGroups');
    let groupLength = quantityGroups.length;
    if (!isEmpty(targetUnit)) {
      if (selectedUnit === targetUnit) {
        // Done
        if (index < (groupLength - 1)) {
          quantityGroups.removeAt((index + 1), (groupLength - 1) - index);
        }
      } else {
        if (index === (groupLength - 1)) {
          quantityGroups.addObject({
            unitName: selectedUnit,
            unit: targetUnit,
            index: quantityGroups.length
          });
        } else {
          set(quantityGroups.objectAt(index + 1), 'unitName', selectedUnit);
        }
      }
      once(this, this.calculateTotal);
    }
  }
});
