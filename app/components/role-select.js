import Ember from "ember";
var get = Ember.get;

export default Ember.Select.extend({
    optionValuePath: 'content.roles',
    optionLabelPath: 'content.name',
    
    valueDidChange: Ember.observer('value', function() {
        var content = get(this, 'content'),
        value = get(this, 'value'),
        valuePath = get(this, 'optionValuePath').replace(/^content\.?/, ''),
        selectedValue = (valuePath ? get(this, 'selection.' + valuePath) : get(this, 'selection')),
        selection;
        if (Ember.compare(value,selectedValue) !== 0)  {
            selection = content ? content.find(
                function(obj) {                    
                    return Ember.compare(value,(valuePath ? get(obj, valuePath) : obj)) === 0;
                }) : null;
            this.set('selection', selection);
        }
    }),
});
