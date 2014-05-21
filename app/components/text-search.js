export default Ember.TextField.extend(Ember.TargetActionSupport, {
    change: function() {
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
