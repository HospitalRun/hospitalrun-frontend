import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';
import PatientInvoicesMixin from 'hospitalrun/mixins/patient-invoices';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import Ember from 'ember';

function deleteMany(manyArray) {
  if (manyArray.then) {
    return manyArray.then(deleteMany);
  }
  var recordsCount = manyArray.get('length');
  if (!recordsCount) {
    // empty array: no records to delete
    return Ember.RSVP.resolve();
  }
  console.log('deleting ' + recordsCount + ' records');
  return Ember.RSVP.all(manyArray.invoke('destroyRecord', 'async array deletion'));
}

export default AbstractDeleteController.extend(PatientVisitsMixin, PatientInvoicesMixin, PouchDbMixin, {
  title: 'Delete Patient',

  // Override delete action on controller; we must delete
  // all related records before deleting patient record
  // otherwise errors will occur
  deletePatient: function() {
    var patient = this.get('model');
    var promises = [];
    promises.push(this.deleteVisits(patient));
    promises.push(this.deleteInvoices(patient));
    Ember.RSVP.all(promises)
      .then(function() {
         patient.destroyRecord();
      });
    this.send(this.get('afterDeleteAction'), patient);
  },

  deleteVisits: function(patient) {
    return this.getPatientVisits(patient).then(function(visits) {
      var promises = [];
      visits.forEach(function(visit) {
        promises.push(deleteMany(visit.get('labs')));
        promises.push(deleteMany(visit.get('patientNotes')));
        promises.push(deleteMany(visit.get('vitals')));
        promises.push(deleteMany(visit.get('procedures')));
        promises.push(deleteMany(visit.get('medication')));
        promises.push(deleteMany(visit.get('imaging')));
      });
      return Ember.RSVP.all(promises).then(function(){
         return deleteMany(visits);
      });
    });
  },

  deleteInvoices: function(patient) {
    this.getPatientInvoices(patient).then(function(invoices){
      deleteMany(invoices);
    });
  },

  actions: {
    // delete related records without modal dialogs
    delete: function(patient) {
      this.deletePatient(patient);
      this.send('closeModal');
    }
  }
});
