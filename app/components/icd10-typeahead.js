import TypeAhead from "hospitalrun/components/type-ahead";
export default TypeAhead.extend({
    lastHint: null,
    selectionKey: 'id', 
    
    _getSource: function() {
        return this.bloodhound.ttAdapter();
    },
    
    didInsertElement: function() {
        this._super();
        var $input = this.get('inputElement');
        $input.on('keyup', function() {
            var $hint = this.$('.tt-hint'),
                hintValue = $hint.val();
                this.set('lastHint', hintValue);
                this.set('selectedItem', false);
                this.set('selection', null);            
        }.bind(this));
        
        $input.on('blur', function(event) {
            if (!this.get('selectedItem')) {
                var lastHint = this.get('lastHint'),
                    exactMatch = false;
                if (Ember.isEmpty(lastHint)) {
                    lastHint = event.target.value;
                    exactMatch = true;
                }
                if (!Ember.isEmpty(event.target.value) && !Ember.isEmpty(lastHint)) {
                    this.bloodhound.get(lastHint, function(suggestions) {                        
                        if (suggestions.length > 0) {
                            if (!exactMatch || lastHint.toLowerCase() === suggestions[0].value.toLowerCase()) {
                                this.set('selectedItem', true);
                                this.set('selection', suggestions[0].id);
                                event.target.value = suggestions[0].value;
                            }
                        }
                    }.bind(this));
                }                
            }
        }.bind(this));        
    }
});