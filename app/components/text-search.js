export default Ember.TextField.extend(Ember.TargetActionSupport, {
    change: function(event) {
        this.triggerAction({
            action: 'search'
        });
    },
    
    insertNewline: function() {
        this.triggerAction({
            action: 'search'
        });
    }
});
