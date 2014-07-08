import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
import InvoiceMapping from 'hospitalrun/mixins/invoice-mapping';

export default AbstractItemRoute.extend(InvoiceMapping, {
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