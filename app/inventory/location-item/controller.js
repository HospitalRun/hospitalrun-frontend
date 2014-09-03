export default Ember.ObjectController.extend({
    haveItems: function() {
        var quantity = this.get('quantity');
        return (quantity > 0);
    }.property('quantity')
});