import Ember from 'ember';
export default Ember.Component.extend({
  quantityGroups: null,
  calculated: null,
  currentUnit: null,
  targetUnit: null,
  unitList: null,

  showTotal: function() {
    let calculated = this.get('calculated');
    let quantityGroups = this.get('quantityGroups');
    if (quantityGroups.length > 1 && !Ember.isEmpty(calculated) && !isNaN(calculated)) {
      return true;
    }
    return false;
  }.property('calculated'),

  currentQuantityGroups: function() {
    let calculated = this.get('calculated');
    let firstQuantityObject;
    let quantityGroups = this.get('quantityGroups');
    let targetUnit = this.get('targetUnit');
    if (Ember.isEmpty(quantityGroups)) {
      quantityGroups = new Array({
        index: 0,
        unit: targetUnit,
        firstQuantity: true,
        quantity: calculated
      });
      this.set('quantityGroups', quantityGroups);
    }
    firstQuantityObject = quantityGroups.get('firstObject');
    if (!Ember.isEmpty(firstQuantityObject)) {
      let selectedUnit = firstQuantityObject.unit;
      if (Ember.isEmpty(selectedUnit)) {
        this.set('quantityGroups.firstObject.unit', targetUnit);
      } else {
        this.updateCurrentUnit(selectedUnit, 0);
      }
    }
    return quantityGroups;
  }.property('quantityGroups', 'targetUnit'),

  calculateTotal: function() {
    let quantityGroups = this.get('quantityGroups');
    let haveQuantities = false;
    let lastObject = quantityGroups.get('lastObject');
    let targetUnit = this.get('targetUnit');
    haveQuantities = quantityGroups.every(function(item) {
      let quantity = item.quantity;
      let unit = item.unit;
      return (!Ember.isEmpty(quantity) && !Ember.isEmpty(unit) && !isNaN(quantity));
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

  updateCurrentUnit: function(selectedUnit, index) {
    let targetUnit = this.get('targetUnit');
    let quantityGroups = this.get('quantityGroups');
    let groupLength = quantityGroups.length;
    if (!Ember.isEmpty(targetUnit)) {
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
          Ember.set(quantityGroups.objectAt(index + 1), 'unitName', selectedUnit);
        }
      }
      Ember.run.once(this, this.calculateTotal);
    }
  }
});
