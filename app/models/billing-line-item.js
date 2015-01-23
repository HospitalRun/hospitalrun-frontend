import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";

export default AbstractModel.extend({
    lineId: DS.attr(),
    invoice: DS.belongsTo('invoice'),
    originalName: DS.attr('string'),
    modifiedName: DS.attr('string'),
    originalDescription: DS.attr('string'),
    modifiedDescription: DS.attr('string'),
    originalPrice: DS.attr('number'),
    discountPrice: DS.attr('number'),
    /*the individual objects that make up this line item*/
    details: []
});