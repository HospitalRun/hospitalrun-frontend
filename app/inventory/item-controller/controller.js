export default Ember.ObjectController.extend({    
    showAdd: function() {
        return (this.get('type') !== 'Asset');
    }.property('type')
});