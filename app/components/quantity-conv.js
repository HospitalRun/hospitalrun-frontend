import Ember from 'ember';
export default Ember.Component.extend({
  firstQuantity: false,
  quantity: null,
  quantityHelp: null,
  unitName: null,
  unit: null,
  resetUnitName: false,
  targetUnit: Ember.computed.alias('parentView.targetUnit'),
  unitList: null,

  unitClass: function() {
    let selectedUnit = this.get('unit');
    let targetUnit = this.get('targetUnit');
    let unitClass = 'has-success';
    if (!Ember.isEmpty(targetUnit) && Ember.isEmpty(selectedUnit)) {
      this.set('unitHelp', 'please select a unit');
      unitClass = 'has-error';
    } else {
      if (Ember.isEmpty(targetUnit)) {
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
    if (!Ember.isEmpty(targetUnit) && (Ember.isEmpty(quantity) || isNaN(quantity))) {
      this.set('quantityHelp', 'not a valid number');
      quantityClass = 'has-error';
    } else {
      if (Ember.isEmpty(targetUnit)) {
        quantityClass = '';
      }
      this.set('quantityHelp');
    }
    Ember.run.once(this, function() {
      this.get('parentView').calculateTotal();
    });
    return quantityClass;
  }.property('quantity', 'targetUnit')
});
