export default Ember.TextArea.extend(Ember.TargetActionSupport, {
    valueDidChange: Ember.observer('value', function() {
        var value = Ember.get(this, 'value');        
        console.log("Value changed: ",value);
        console.log("Value #2 ", this.get('value'));
        this.triggerAction({
            action: 'search'            
        });
    })
});
