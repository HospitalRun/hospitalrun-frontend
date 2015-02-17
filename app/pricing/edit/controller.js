import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
import PricingOverrideModel from 'hospitalrun/models/pricing-override';
import ReturnTo from 'hospitalrun/mixins/return-to';
export default AbstractEditController.extend(LabPricingTypes, ImagingPricingTypes, ReturnTo, {
    needs: ['pricing'],
    
    actions: {        
        newOverride: function() {
            this.send('openModal', 'pricing.override', PricingOverrideModel.create({
                isNew: true
            }));
        },
        deleteOverride: function(model) {
            var overrideToDelete = model.overrideToDelete,
                profiles = this.get('profiles'),
                profileOverrides = this.get('profileOverrides'),
                profileOverrideToDelete = profileOverrides.findBy('id', overrideToDelete.get('id'));            
            profiles.removeObject(overrideToDelete);
            profileOverrides.removeObject(profileOverrideToDelete);
            this.send('update', true);
            this.send('closeModal');            
        },
        editOverride: function(overrideToEdit) {
            this.send('openModal', 'pricing.override', overrideToEdit);
        },
        showDeleteOverride: function(overrideToDelete) {
            var message= 'Are you sure you want to delete this override?',
                model = Ember.Object.create({
                    overrideToDelete: overrideToDelete
                }),
                title = 'Delete Override';
            this.displayConfirm(title, message, 'deleteOverride', model);
        },
        updateOverride: function(override) {
            var overrideProfile = override.profile,
                overrideProfileId = overrideProfile.get('id'),
                profiles = this.get('profiles'),
                profileOverrides = this.get('profileOverrides'),                
                exisitingProfile = profiles.findBy('id', overrideProfileId),
                existingProfileOverride;
            if (Ember.isEmpty(profileOverrides)) {
                profileOverrides = [];
                this.set('profileOverrides', profileOverrides);
            }
            existingProfileOverride = profileOverrides.findBy('id', overrideProfileId);
            if (Ember.isEmpty(exisitingProfile)) {
                profiles.addObject(overrideProfile);
            }
            if (Ember.isEmpty(existingProfileOverride)) {
                profileOverrides.addObject({
                    id: overrideProfileId,
                    price: override.price
                });
            } else {
                existingProfileOverride.price = override.price;
            }
            this.send('update', true);
            this.send('closeModal');         
        }
    },
    
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