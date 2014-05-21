export default Ember.TextArea.extend(Ember.TargetActionSupport, {
    valueDidChange: Ember.observer('value', function() {
        this.triggerAction({
            action: 'search'            
        });
    })
});
