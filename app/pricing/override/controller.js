import Ember from "ember";
import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";

export default Ember.ObjectController.extend(IsUpdateDisabled, {
    needs: ['pricing','pricing/edit'],        

    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        update: function() {
            if (this.get('isValid')) {
                var override = this.get('model');
                this.get('editController').send('updateOverride',override);
            }
        }
    },

    editController: Ember.computed.alias('controllers.pricing/edit'),    
    pricingProfiles: Ember.computed.alias('controllers.pricing.pricingProfiles'),
    showUpdateButton: true,
    
    title: function() {
        if (this.get('isNew')) {            
            return 'Add Override';
        } else {
            return 'Edit Override';
        }
    }.property('isNew'),
    
    updateButtonAction: 'update',
    updateButtonText: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew'),

    
});
