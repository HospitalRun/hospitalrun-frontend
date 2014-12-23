import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import InvoiceMapping from 'hospitalrun/mixins/invoice-mapping';

export default AbstractModuleRoute.extend(InvoiceMapping, {
    addCapability: 'add_invoice',
    currentScreenTitle: 'Invoices',
    editTitle: 'Edit Invoice',    
    newTitle: 'New Invoice',
    moduleName: 'invoices',
    newButtonText: '+ new invoice',
    sectionTitle: 'Invoices',
    
    model: function() {
        return this.store.find('invoice', {
            mapResults: this._mapViewResults,
            fieldMapping: this.fieldMapping
        });
    }    
});