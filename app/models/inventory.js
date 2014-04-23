var Inventory = DS.Model.extend({
    description: DS.attr('string'),
    keywords: DS.attr(),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    crossReference: DS.attr('string'),
    type: DS.attr('string')
});

export default Inventory;
