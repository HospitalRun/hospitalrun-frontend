import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
  cancelAction: 'closeModal',
  findPatientVisits: false,
  invoiceController: Ember.inject.controller('invoices'),
  newPayment: false,

  expenseAccountList: Ember.computed.alias('invoiceController.expenseAccountList'),
  patientList: Ember.computed.alias('invoiceController.patientList'),

  _finishUpdate: function(message, title) {
    this.send('closeModal');
    this.displayAlert(title, message);
  },

  currentPatient: function() {
    var type = this.get('model.paymentType');
    if (type === 'Deposit') {
      return this.get('model.patient');
    } else {
      return this.get('model.invoice.patient');
    }
  }.property('model.patient', 'model.paymentType', 'model.invoice.patient'),

  title: function() {
    var isNew = this.get('model.isNew'),
      type = this.get('model.paymentType');
    if (isNew) {
      return 'Add %@'.fmt(type);
    } else {
      return 'Edit %@'.fmt(type);
    }
  }.property('model.isNew', 'model.paymentType'),

  selectPatient: function() {
    var isNew = this.get('model.isNew'),
      type = this.get('model.paymentType');
    return (isNew && type === 'Deposit');
  }.property('model.isNew', 'model.paymentType'),

  beforeUpdate: function() {
    if (this.get('model.isNew')) {
      this.set('newPayment', true);
    } else {
      this.set('newPayment', false);
    }
    var patient = this.get('currentPatient');
    this.set('model.charityPatient', patient.get('patientType') === 'Charity');
    return Ember.RSVP.resolve();
  },

  afterUpdate: function() {
    this.get('model').save().then(function(record) {
      if (this.get('newPayment')) {
        var patient = this.get('currentPatient');
        patient.get('payments').then(function(payments) {
          payments.addObject(record);
          patient.save().then(function() {
            if (record.get('paymentType') === 'Deposit') {
              var message = 'A deposit of %@ was added for patient %@'.fmt(record.get('amount'), patient.get('displayName'));
              this._finishUpdate(message, 'Deposit Added');
            } else {
              var invoice = this.get('model.invoice');
              invoice.addPayment(record);
              invoice.save().then(function() {
                var message = 'A payment of %@ was added to invoice %@'.fmt(record.get('amount'), invoice.get('id'));
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
