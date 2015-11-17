import Ember from 'ember';
export default Ember.ObjectController.extend({
    canRemovePayment: function() {        
        return (this.get('type') === 'Deposit');
    }.property()
});