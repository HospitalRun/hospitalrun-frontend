import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';

export default AbstractModuleRoute.extend({
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
    }]
    
});