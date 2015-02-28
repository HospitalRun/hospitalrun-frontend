import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import ModalHelper from 'hospitalrun/mixins/modal-helper';

export default AbstractModuleRoute.extend(ModalHelper, {
    addCapability: 'add_invoice',
    currentScreenTitle: 'Invoices',
    editTitle: 'Edit Invoice',    
    newTitle: 'New Invoice',
    moduleName: 'invoices',
    newButtonText: '+ new invoice',
    sectionTitle: 'Invoices',
    
    additionalModels: [{ 
        name: 'billingCategoryList',
        findArgs: ['lookup','billing_categories']
    }, { 
        name: 'pricingProfiles',
        findArgs: ['price-profile']
    }],
    
        
    actions: {
        addPayment: function(payment) {
            var invoice = payment.get('invoice');
            invoice.addPayment(payment);
            invoice.save().then(function() {                
                this.send('closeModal');
                var message = 'A payment of %@ was added to invoice %@'.fmt(payment.get('amount'), invoice.get('id'));
                this.displayAlert('Payment added', message); 
            }.bind(this));            
        },
        
        showAddPayment: function(invoice) {
            var payment = this.store.createRecord('payment', {
                invoice: invoice,
                datePaid: new Date()
            });
            this.send('openModal','invoices.payment', payment);            
        },
        
        showEditPayment: function(payment) {
            if (this.currentUserCan('add_payment')) {
                this.send('openModal','invoices.payment', payment);
            }
        },
    }
    
});