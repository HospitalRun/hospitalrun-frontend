import { resolve } from 'rsvp';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
  cancelAction: 'closeModal',
  findPatientVisits: false,
  invoiceController: controller('invoices'),
  newPayment: false,

  expenseAccountList: alias('invoiceController.expenseAccountList'),
  patientList: alias('invoiceController.patientList'),

  _finishUpdate(message, title) {
    this.send('closeModal');
    this.displayAlert(title, message);
  },

  currentPatient: computed('model.isNew', 'model.paymentType', 'model.invoice.patient', function() {
    let type = this.get('model.paymentType');
    if (type === 'Deposit') {
      return this.get('model.patient');
    } else {
      return this.get('model.invoice.patient');
    }
  }),

  title: computed('model.isNew', 'model.paymentType', function() {
    let isNew = this.get('model.isNew');
    let type = this.get('model.paymentType');
    if (isNew) {
      return `Add ${type}`;
    } else {
      return `Edit ${type}`;
    }
  }),

  selectPatient: computed('model.isNew', 'model.paymentType', function() {
    let isNew = this.get('model.isNew');
    let type = this.get('model.paymentType');
    return (isNew && type === 'Deposit');
  }),

  beforeUpdate() {
    if (this.get('model.isNew')) {
      this.set('newPayment', true);
    } else {
      this.set('newPayment', false);
    }
    let patient = this.get('currentPatient');
    this.set('model.charityPatient', patient.get('patientType') === 'Charity');
    return resolve();
  },

  afterUpdate() {
    this.get('model').save().then(function(record) {
      if (this.get('newPayment') === true) {
        let patient = this.get('currentPatient');
        patient.get('payments').then(function(payments) {
          payments.addObject(record);
          patient.save().then(function() {
            if (record.get('paymentType') === 'Deposit') {
              let message = `A deposit of ${record.get('amount')} was added for patient ${patient.get('displayName')}`;
              this._finishUpdate(message, 'Deposit Added');
            } else {
              let invoice = this.get('model.invoice');
              invoice.addPayment(record);
              invoice.save().then(function() {
                let message = `A payment of ${record.get('amount')} was added to invoice ${invoice.get('id')}`;
                this._finishUpdate(message, 'Payment Added');
              }.bind(this));
            }
          }.bind(this));
        }.bind(this));
      } else {
        this.send('closeModal');
      }
    }.bind(this));
  }
});
