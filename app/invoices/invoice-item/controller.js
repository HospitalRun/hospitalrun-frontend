import Ember from 'ember';
import NumberFormat from "hospitalrun/mixins/number-format";
export default Ember.ObjectController.extend(NumberFormat, {
    
    showActions: function() {
        var showActions = this.parentController.get('showActions');
        if (showActions) {
            var status = this.get('status');
            if (status === 'Paid') {
                return false;
            }
            return true;
        }
    }.property('status')
});