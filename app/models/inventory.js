var Inventory = DS.Model.extend({
    description: DS.attr('string'),
    keywords: DS.attr(),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    crossreference: DS.attr('string')
});

export default Inventory;
