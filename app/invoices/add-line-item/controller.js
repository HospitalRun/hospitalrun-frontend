import BillingCategories from 'hospitalrun/mixins/billing-categories';
import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';

export default Ember.ObjectController.extend(BillingCategories, IsUpdateDisabled, {
    needs: ['invoices','invoices/edit'],
    
    billingCategoryList: Ember.computed.alias('controllers.invoices.billingCategoryList'),
    editController: Ember.computed.alias('controllers.invoices/edit'),    
    title: 'Add Line Item',
    updateButtonText: 'Add',
    updateButtonAction: 'add',
    showUpdateButton: true,
            
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        add: function() {
            this.get('model').save().then(function(record){
                this.get('editController').send('addLineItem',record);
            }.bind(this));
        }
    },
    
    billingCategories: function() {
        var defaultBillingCategories = this.get('defaultBillingCategories'),
            billingCategoryList = this.get('billingCategoryList');
        if (Ember.isEmpty(billingCategoryList)) {
            return defaultBillingCategories;
        } else {
            return billingCategoryList;
        }
    }.property('billingCategoryList', 'defaultBillingCategories'),    

});
