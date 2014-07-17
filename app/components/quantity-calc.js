export default Ember.Component.extend({
    quantityGroups: [],
    calculated: null,
    currentUnit: null,
    targetUnit: null,
    targetUnitName: null,
    showTotal: false,
    _setup: function() {
        var targetUnit = this.get('targetUnit'),
            quantityGroups = this.get('quantityGroups');
        quantityGroups.clear();
        quantityGroups.addObject(Ember.Object.create({
            index: 0,
            unit: String(targetUnit),
            firstQuantity: true
        }));        
    }.on('init'), 
    
    calculateTotal: function() {
        var quantityGroups = this.get('quantityGroups'),
            haveQuantities = false,
            lastObject = quantityGroups.get('lastObject'),
            targetUnit = this.get('targetUnit');
        haveQuantities = quantityGroups.every(function(item) {
            var quantity = item.get('quantity');
            return (!Ember.isEmpty(quantity) && !isNaN(quantity));
        });
        if (haveQuantities && lastObject.get('unit') === targetUnit) {
            var newValue = quantityGroups.reduce(function(previousValue, item) {
                return previousValue * parseInt(item.get('quantity'));                            
            }, 1);
            this.set('calculated', newValue);
            this.set('showTotal', true);
        } else {
            this.set('showTotal', false);
        }
    },

    updateCurrentUnit: function(selectedUnit, index) {      
        var targetUnit = this.get('targetUnit'),            
            quantityGroups = this.get('quantityGroups'),
            groupLength = quantityGroups.length;
        if (selectedUnit === targetUnit) {
            //Done
            if (index < (groupLength - 1)) {
                quantityGroups.removeAt((index+1), (groupLength-1) - index);
            }
        } else {
            if (index === (groupLength - 1)) {
                quantityGroups.addObject(Ember.Object.create({
                    unitName: String(selectedUnit),
                    unit: String(targetUnit),
                    index: quantityGroups.length
                }));
            } else {                
                quantityGroups.objectAt(index+1).set('unitName', selectedUnit);
            }
        }
        Ember.run.once(this, this.calculateTotal);
    }
});