import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';

export default AbstractModel.extend({
    category: DS.attr('string'),
    expenseAccount: DS.attr('string'),
    name: DS.attr('string'),
    price: DS.attr('number'),
    type: DS.attr('string'),
    profiles: DS.hasMany('price-profile'),
    profileOverrides: DS.attr(), //Array of objects containing {id: profileid, price: override price}}
    
    pricingOverrides: function() {
        var profiles = this.get('profiles'),
            profileOverrides = this.get('profileOverrides'),
            pricingOverrides = [];
        if (Ember.isEmpty(profileOverrides)) {
            profileOverrides = [];
        }
        if (!Ember.isEmpty(profiles)) {            
            pricingOverrides = profiles.map(function(profile) {
                var pricingOverride = {
                        profile: profile
                    },
                    profileOverride = profileOverrides.findBy('id', profile.get('id'));
                if (!Ember.isEmpty(profileOverride)) {
                    pricingOverride.price = profileOverride.price;
                }
                return pricingOverride;
            });
        }
        return pricingOverrides;
    }.property('profiles', 'profileOverrides'),
    
    validations: {
        category: {
            presence: true
        },
        name: {
            presence: true
        },        
        price: {
            numericality: true
        }
    }
});