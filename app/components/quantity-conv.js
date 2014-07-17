import UnitTypes from "hospitalrun/mixins/unit-types";
export default Ember.Component.extend(UnitTypes, {
    firstQuantity: false,
    quantity: null,
    unitName: null,
    unit: null,
    resetUnitName: false,
            
    unitChanged: function() {
        var selectedUnit = this.get('unit');
        this.get('parentView').updateCurrentUnit(selectedUnit, this.get('index'));
    }.observes('unit'),
    
    quantityChanged: function() {
        Ember.run.once(this, function() {
            this.get('parentView').calculateTotal();
        });
    }.observes('quantity')
});