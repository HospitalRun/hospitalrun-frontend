export default Ember.TextArea.extend(Ember.TargetActionSupport, {
    valueDidChange: Ember.observer('value', function() {
        var value = Ember.get(this, 'value');        
        this.triggerAction({
            action: 'search'            
        });
    })
});
