export default Ember.TextField.extend(Ember.TargetActionSupport, {
    change: function(event) {
        console.log("File changed!",event);
        this.triggerAction({
            action: 'search'
        });
    },
    
    insertNewline: function() {
        this.triggerAction();
    }
});
