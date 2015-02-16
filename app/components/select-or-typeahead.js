import Ember from "ember";
export default Ember.Component.extend({
    name: "select-or-typeahead",
    class: null,
    content: null,
    label: null,
    list: null,
    optionLabelPath: 'content',
    optionValuePath: 'content',
    property: null,
    selection: null,
    typeAheadType: null,
    userCanAdd: true, 
    
     /**
     * If list is set, pull the value as the content
     * and the userCanAdd flag from the list.
     */
    _setup: function() {
        this.listChanged();
     }.on('init'),
    
    listChanged: function() {
        var list = this.get('list');
        if (!Ember.isEmpty(list)) {
            this.set('content', list.get('value'));
            this.set('userCanAdd', list.get('userCanAdd'));
        }        
    }.observes('list'),
    
    usePricingTypeAhead: function() {
        return (this.get('typeAheadType') === 'pricing');
    }.property('typeAheadType')
});