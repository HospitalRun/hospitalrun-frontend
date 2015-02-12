import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
export default AbstractEditController.extend(LabPricingTypes, ImagingPricingTypes, {
    needs: ['pricing'],
    categories: [
        'Imaging',
        'Lab',
        'Procedure',
        'Ward'
    ],
    expenseAccountList: Ember.computed.alias('controllers.pricing.expenseAccountList'),
    imagingPricingTypes: Ember.computed.alias('controllers.pricing.imagingPricingTypes'),
    labPricingTypes: Ember.computed.alias('controllers.pricing.labPricingTypes'),
    procedurePricingTypes: Ember.computed.alias('controllers.pricing.procedurePricingTypes'),
    wardPricingTypes: Ember.computed.alias('controllers.pricing.wardPricingTypes'),
    
    lookupListsToUpdate: function() {
        var category = this.get('category').toLowerCase(),
            listsToUpdate = [{
            name: 'expenseAccountList', 
            property: 'expenseAccount', 
            id: 'expense_account_list'
        }];
        listsToUpdate.push({       
            name: category+'PricingTypes', 
            property: 'type',
            id: category+'_pricing_types'
        });
        return listsToUpdate;
    }.property('category'),
    
    pricingTypes: function() {
        var category = this.get('category');
        if (!Ember.isEmpty(category)) {
            var typesList = this.get(category.toLowerCase() + 'PricingTypes');
            if (Ember.isEmpty(typesList) || Ember.isEmpty(typesList.get('value'))) {
                if (category === 'Lab') {
                    return Ember.Object.create({value: this.defaultLabPricingTypes});
                } else if (category === 'Imaging') {
                    return Ember.Object.create({value: this.defaultImagingPricingTypes});
                }
            }
            return typesList;
        }
    }.property('category'),
    
    updateCapability: 'add_pricing',
    
    afterUpdate: function(record) {
        var message =  'The pricing record for %@ has been saved.'.fmt(record.get('name'));
        this.displayAlert('Pricing Item Saved', message);        
    }
});