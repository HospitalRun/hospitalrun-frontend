import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import InvoiceMapping from 'hospitalrun/mixins/invoice-mapping';

export default AbstractModuleRoute.extend(InvoiceMapping, {
    currentScreenTitle: 'Invoices',
    editTitle: 'Edit Invoice',    
    newTitle: 'New Invoice',
    modelName: 'invoice',
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