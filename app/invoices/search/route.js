import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import InvoiceSearch from 'hospitalrun/utils/invoice-search';
export default AbstractSearchRoute.extend({
  moduleName: 'invoices',
  searchKeys: [
    'externalInvoiceNumber',
    'patientInfo'
  ],
  searchIndex: InvoiceSearch,
  searchModel: 'invoice'
});
