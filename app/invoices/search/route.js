import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    moduleName: 'invoices',
    searchKeys: [
        'invoiceNumber',
        'invoiceId',
        'patientName',
        'publishStatus',
        'createDate',
        'publishDate'
    ],
    searchModel: 'invoice'
});
