
function buildPouchFindIndexes(db) {
  var indexesToBuild = [{
    name: 'inventory',
    fields: [
      'data.crossReference',
      'data.description',
      'data.friendlyId',
      'data.name'
    ]
  }, {
    name: 'invoices',
    fields: [
      'data.externalInvoiceNumber',
      'data.patientInfo'
    ]
  }, {
    name: 'patient',
    fields: [
      'data.externalPatientId',
      'data.firstName',
      'data.friendlyId',
      'data.lastName',
      'data.phone'
    ]
  }, {
    name: 'medication',
    fields: [
      'data.prescription'
    ]
  }, {
    name: 'pricing',
    fields: [
      'data.name'
    ]
  }];
  indexesToBuild.forEach(function(index) {
    db.createIndex({
      index: {
        fields: index.fields,
        name: index.name
      }
    });
  });
}
