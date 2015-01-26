import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),    
    originalPrice: DS.attr('number'),
    discountPrice: DS.attr('number'),
    /*the individual objects that make up this line item*/
    details: []
});