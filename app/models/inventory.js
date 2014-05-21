import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    description: DS.attr('string'),
    keywords: DS.attr(),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    crossReference: DS.attr('string'),
    type: DS.attr('string'),
    barcodeUri: function() {
        var id = this.get('id'),
            name = this.get('name');
        return Ember.$(document).JsBarcode(id,{
            width:1,
            height:20,
            fontSize: 10,         
            displayValue: name,
            returnUri: true
        });
    }.property('id', 'name')    
});
