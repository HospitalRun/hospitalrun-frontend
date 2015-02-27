import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(PatientListRoute, {
    editTitle: 'Edit Invoice',
    modelName: 'invoice',
    newTitle: 'New Invoice',
    
    actions: {
        deleteCharge: function(model) {
            this.controller.send('deleteCharge', model);
        },
        
        deleteLineItem: function(model) {
            this.controller.send('deleteLineItem', model);
        },
    },
    
    afterModel: function(model) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var lineItems = model.get('lineItems'),
                promises = [];
            lineItems.forEach(function(lineItem) {
                promises.push(lineItem.reload());
            });
            Ember.RSVP.all(promises, 'Reload billing line items for invoice').then(function(results) {
                var detailPromises = [];
                results.forEach(function(result) {
                    result.get('details').forEach(function(detail) {
                        detailPromises.push(detail.reload());                        
                    });
                });
                Ember.RSVP.all(detailPromises, 'Reload billing line item details for invoice').then(resolve, reject);
            },reject);
        });
    },
    
    getNewData: function() {
        return Ember.RSVP.resolve({
            billDate: new Date(),
            selectPatient: true            
        });
    },
    
    setupController: function(controller, model) {
        model.set('originalPaymentProfileId', model.get('paymentProfile.id'));    
        this._super(controller, model);
        var lineItems = model.get('lineItems'),
            promises = [];
        lineItems.forEach(function(lineItem) {
            lineItem.get('details').forEach(function(detail) {
               promises.push(detail.get('pricingItem').reload());
            });
        });
    }
});