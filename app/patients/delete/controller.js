import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';
import PatientInvoicesMixin from 'hospitalrun/mixins/patient-invoices';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import Ember from 'ember';

function deleteMany(manyArray) {
  if (!manyArray) {
    return Ember.RSVP.resolve();
  }
  if (manyArray.then) {
    // recursive call after resolving async model
    return manyArray.then(deleteMany);
  }
  var recordsCount = manyArray.get('length');
  if (!recordsCount) {
    // empty array: no records to delete
    return Ember.RSVP.resolve();
  }
  return Ember.RSVP.all(manyArray.invoke('destroyRecord', 'async array deletion'));
}

export default AbstractDeleteController.extend(PatientVisitsMixin, PatientInvoicesMixin, PouchDbMixin, ProgressDialog, {
  title: 'Delete Patient',
  progressTitle: 'Delete Patient Record',
  progressMessage: 'Deleting patient and all associated records',

  // Override delete action on controller; we must delete
  // all related records before deleting patient record
  // otherwise errors will occur
  deletePatient: function() {
    var controller = this;
    var patient = this.get('model');
    var visits = this.getPatientVisits(patient);
    var invoices = this.getPatientInvoices(patient);
    // resolve all async models first since they reference each other, then delete
    return Ember.RSVP.all([visits, invoices]).then(function(records) {
      var promises = [];
      promises.push(controller.deleteVisits(records[0]));
      promises.push(controller.deleteInvoices(records[1]));
      return Ember.RSVP.all(promises)
        .then(function() {
          return patient.destroyRecord();
        });
    });
  },

  deleteVisits: function(visits) {
    var promises = [];
    visits.forEach(function(visit) {
      promises.push(deleteMany(visit.get('labs')));
      promises.push(deleteMany(visit.get('patientNotes')));
      promises.push(deleteMany(visit.get('vitals')));
      promises.push(deleteMany(visit.get('procedures')));
      promises.push(deleteMany(visit.get('medication')));
      promises.push(deleteMany(visit.get('imaging')));
    });
    return Ember.RSVP.all(promises).then(function() {
      return deleteMany(visits);
    });
  },

  deleteInvoices: function(invoices) {
    var lineItems = invoices.get('lineItems');
    var payments = invoices.get('payments');
    return Ember.RSVP.all([lineItems, payments]).then(function() {
      return deleteMany(invoices);
    });
  },

  actions: {
    // delete related records without modal dialogs
    delete: function(patient) {
      var controller = this;
      this.send('closeModal');
      this.showProgressModal();
      this.deletePatient(patient).then(function() {
        controller.closeProgressModal();
        controller.send(controller.get('afterDeleteAction'), patient);
      });
    }
  }
});
