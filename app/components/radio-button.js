import Ember from "ember";
export default Ember.Component.extend({
     tagName : "input",
     type : "radio",
     attributeBindings : [ "name", "type", "value", "checked:checked" ],
     
     init: function() {
        this.labelPathDidChange();
        this.valuePathDidChange();
        this._super();
     },
     
     click : function() {
         var value = this.$().val();
         this.set('selection', value);
     },
     checked : function() {
         return this.get("value") === this.get("selection");
     }.property('selection'),
     
     labelPathDidChange: Ember.observer('parentView.radioLabelPath', function() {
        var labelPath = this.get('parentView.radioLabelPath');

        if (!labelPath) { return; }

        Ember.defineProperty(this, 'label', Ember.computed(function() {
            return this.get(labelPath);
        }).property(labelPath));
    }),

    valuePathDidChange: Ember.observer('parentView.radioValuePath', function() {
        var valuePath = this.get('parentView.radioValuePath');

        if (!valuePath) { return; }

        Ember.defineProperty(this, 'value', Ember.computed(function() {
            return this.get(valuePath);
        }).property(valuePath));
    })
});