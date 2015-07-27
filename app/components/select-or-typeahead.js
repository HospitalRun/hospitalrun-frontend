import Ember from "ember";
export default Ember.Component.extend({
    name: "select-or-typeahead",
    class: null,    
    hint: true,
    label: null,
    list: null,
    optionLabelPath: 'content',
    optionValuePath: 'content',
    property: null,
    prompt: ' ',
    selection: null,
    setOnBlur: true,
    typeAheadType: null,
    
    content: function() {
        var list = this.get('list');
        if (!Ember.isEmpty(list) && list.get) {
            return list.get('value');
        }
    }.property('list'),
            
    usePricingTypeAhead: function() {
        return (this.get('typeAheadType') === 'pricing');
    }.property('typeAheadType'),
    
    userCanAdd: function() {
        var list = this.get('list');
        if (!Ember.isEmpty(list) && list.get) {            
           return list.get('userCanAdd');
        } else {
            return true;
        }
    }.property('list')
});