import Ember from 'ember';
export default Ember.ObjectController.extend({
    canAddCharge: function() {
        return this.parentController.get('canAddCharge');
    }.property()    
});