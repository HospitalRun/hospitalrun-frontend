export default Ember.Component.extend({
    quantityGroups: null,
    calculated: null,
    currentUnit: null,
    targetUnit: null,
    
    showTotal: function() {
        var calculated = this.get('calculated'),
            quantityGroups = this.get('quantityGroups');
        if (quantityGroups.length > 1 && !Ember.isEmpty(calculated) && !isNaN(calculated)) {
            return true;
        }
        return false;
    }.property('calculated'),
    
    targetUnitChanged: function() {
        var selectedUnit = this.get('quantityGroups.firstObject.unit');
        this.updateCurrentUnit(selectedUnit, 0);
    }.observes('targetUnit'),
    
    _setup: function() {
        var calculated = this.get('calculated'),
            targetUnit = this.get('targetUnit'),
            quantityGroups = this.get('quantityGroups');
        if (Ember.isEmpty(quantityGroups)) {
            quantityGroups = new Array({
                index: 0,
                unit: targetUnit,
                firstQuantity: true,
                quantity: calculated
            });
            this.set('quantityGroups',quantityGroups);
        }
    }.on('init'), 
    
    calculateTotal: function() {
        var quantityGroups = this.get('quantityGroups'),
            haveQuantities = false,
            lastObject = quantityGroups.get('lastObject'),
            targetUnit = this.get('targetUnit');
        haveQuantities = quantityGroups.every(function(item) {
            var quantity = item.quantity;
            return (!Ember.isEmpty(quantity) && !isNaN(quantity));
        });
        if (haveQuantities && lastObject.unit === targetUnit) {
            var newValue = quantityGroups.reduce(function(previousValue, item) {
                return previousValue * parseInt(item.quantity);  
            }, 1);
            this.set('calculated', newValue);            
        } else {
            this.set('calculated');            
        }
    },

    updateCurrentUnit: function(selectedUnit, index) {
        var targetUnit = this.get('targetUnit'),            
            quantityGroups = this.get('quantityGroups'),
            groupLength = quantityGroups.length;
        if (!Ember.isEmpty(targetUnit)) {
            if (selectedUnit === targetUnit) {
                //Done
                if (index < (groupLength - 1)) {
                    quantityGroups.removeAt((index+1), (groupLength-1) - index);
                }
            } else {
                if (index === (groupLength - 1)) {
                    quantityGroups.addObject({
                        unitName: selectedUnit,
                        unit: targetUnit,
                        index: quantityGroups.length
                    });
                } else {
                    Ember.set(quantityGroups.objectAt(index+1), 'unitName',selectedUnit);
                }
            }
            Ember.run.once(this, this.calculateTotal);
        }
    }
});