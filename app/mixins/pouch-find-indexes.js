<<<<<<< HEAD
import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  buildPouchFindIndexes(db) {
    let indexesToBuild = [{
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
});
=======
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  buildPouchFindIndexes(db) {
    let indexesToBuild = [{
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
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
