export default {
  fields: ['patientInfo', 'externalInvoiceNumber'],
  filter: function(doc) {
    var uidx = doc._id.indexOf('_'),
      doctype = doc._id.substring(0, uidx);
    return (doctype === 'invoice');
  }
};
