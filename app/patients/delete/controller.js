import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';
import PatientAppointmentsMixin from 'hospitalrun/mixins/patient-appointments';
import PatientInvoicesMixin from 'hospitalrun/mixins/patient-invoices';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

function deleteMany(manyArray) {
  if (!manyArray) {
    return Ember.RSVP.resolve();
  }
  if (manyArray.then) {
    // recursive call after resolving async model
    return manyArray.then(deleteMany);
  }
  let recordsCount = manyArray.get('length');
  if (!recordsCount) {
    // empty array: no records to delete
    return Ember.RSVP.resolve();
  }
  let archivePromises = manyArray.map((recordToDelete) => {
    recordToDelete.set('archived', true);
    return recordToDelete.save().then(() => {
      return recordToDelete.unloadRecord();
    });
  });
  return Ember.RSVP.all(archivePromises, 'async array deletion');
}

export default AbstractDeleteController.extend(PatientVisitsMixin, PatientInvoicesMixin, PouchDbMixin, ProgressDialog, PatientAppointmentsMixin, {
  title: t('patients.titles.delete'),
  progressTitle: t('patients.titles.deletePatientRecord'),
  progressMessage: t('patients.messages.deletingPatient'),

  // Override delete action on controller; we must delete
  // all related records before deleting patient record
  // otherwise errors will occur
  deletePatient: function() {
    let controller = this;
    let patient = this.get('model');
    let visits = this.getPatientVisits(patient);
    let invoices = this.getPatientInvoices(patient);
    let appointments = this.getPatientAppointments(patient);
    let payments = patient.get('payments');
    // resolve all async models first since they reference each other, then delete
    return Ember.RSVP.all([visits, invoices, appointments, payments]).then(function(records) {
      let promises = [];
      promises.push(controller.deleteVisits(records[0]));
      promises.push(controller.deleteInvoices(records[1]));
      promises.push(deleteMany(records[2]));   // appointments
      promises.push(deleteMany(records[3]));   // payments
      return Ember.RSVP.all(promises)
        .then(function() {
          return patient.destroyRecord();
        });
    });
  },

  deleteVisits: function(visits) {
    let promises = [];
    visits.forEach(function(visit) {
      let labs = visit.get('labs');
      let procedures = visit.get('procedures');
      let imaging = visit.get('imaging');
      let procCharges = procedures.then(function(p) {
        return p.get('charges');
      });
      let labCharges = labs.then(function(l) {
        return l.get('charges');
      });
      let imagingCharges = imaging.then(function(i) {
        return i.get('charges');
      });
      let visitCharges = visit.get('charges');
      promises.push(deleteMany(labs));
      promises.push(deleteMany(labCharges));
      promises.push(deleteMany(visit.get('patientNotes')));
      promises.push(deleteMany(visit.get('vitals')));
      promises.push(deleteMany(procedures));
      promises.push(deleteMany(procCharges));
      promises.push(deleteMany(visit.get('medication')));
      promises.push(deleteMany(imaging));
      promises.push(deleteMany(imagingCharges));
      promises.push(deleteMany(visitCharges));
    });
    return Ember.RSVP.all(promises).then(function() {
      return deleteMany(visits);
    });
  },

  deleteInvoices: function(patientInvoices) {
    return Ember.RSVP.resolve(patientInvoices).then(function(invoices) {
      let lineItems = Ember.A();
      invoices.forEach(function(i) {
        lineItems.addObjects(i.get('lineItems'));
      });
      let lineItemDetails = Ember.A();
      lineItems.forEach(function(li) {
        lineItemDetails.addObjects(li.get('details'));
      });
      return Ember.RSVP.all([lineItems, lineItemDetails]).then(function() {
        return Ember.RSVP.all([deleteMany(invoices), deleteMany(lineItems), deleteMany(lineItemDetails)]);
      });
    });
  },

  actions: {
    // delete related records without modal dialogs
    delete: function(patient) {
      let controller = this;
      this.send('closeModal');
      this.showProgressModal();
      this.deletePatient(patient).then(function() {
        controller.closeProgressModal();
        controller.send(controller.get('afterDeleteAction'), patient);
      });
    }
  }
});
