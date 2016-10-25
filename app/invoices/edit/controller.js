import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PublishStatuses from 'hospitalrun/mixins/publish-statuses';
import SelectValues from 'hospitalrun/utils/select-values';

export default AbstractEditController.extend(NumberFormat, PatientSubmodule, PublishStatuses, {
  invoiceController: Ember.inject.controller('invoices'),
  expenseAccountList: Ember.computed.alias('invoiceController.expenseAccountList.value'),
  patientList: Ember.computed.alias('invoiceController.patientList'),
  pharmacyCharges: [],
  pricingProfiles: Ember.computed.map('invoiceController.pricingProfiles', SelectValues.selectObjectMap),
  supplyCharges: [],
  updateCapability: 'add_invoice',
  wardCharges: [],

  additionalButtons: function() {
    let buttons = [];
    let isValid = this.get('model.isValid');
    let status = this.get('model.status');
    if (isValid && status === 'Draft') {
      buttons.push({
        class: 'btn btn-default default',
        buttonAction: 'finalizeInvoice',
        buttonIcon: 'glyphicon glyphicon-ok',
        buttonText: 'Invoice Ready'
      });
    }
    buttons.push({
      class: 'btn btn-default neutral',
      buttonAction: 'printInvoice',
      buttonIcon: 'glyphicon glyphicon-print',
      buttonText: 'Print'
    });
    return buttons;

  }.property('model.isValid', 'model.status'),

  canAddCharge: function() {
    return this.currentUserCan('add_charge');
  }.property(),

  canAddPayment: function() {
    return this.currentUserCan('add_payment');
  }.property(),

  pharmacyExpenseAccount: function() {
    let expenseAccountList = this.get('expenseAccountList');
    if (!Ember.isEmpty(expenseAccountList)) {
      let account = expenseAccountList.find(function(value) {
        if (value.toLowerCase().indexOf('pharmacy') > -1) {
          return true;
        }
      });
      return account;
    }
  }.property('expenseAccountList.value'),

  actions: {
    addItemCharge: function(lineItem) {
      let details = lineItem.get('details');
      let detail = this.store.createRecord('line-item-detail', {
        id: uuid.v4()
      });
      details.addObject(detail);
    },

    addLineItem: function(lineItem) {
      let lineItems = this.get('model.lineItems');
      lineItems.addObject(lineItem);
      this.send('update', true);
      this.send('closeModal');
    },

    deleteCharge: function(deleteInfo) {
      this._deleteObject(deleteInfo.itemToDelete, deleteInfo.deleteFrom);
    },

    deleteLineItem: function(deleteInfo) {
      this._deleteObject(deleteInfo.itemToDelete, this.get('model.lineItems'));
    },

    finalizeInvoice: function() {
      let currentInvoice = this.get('model');
      let invoicePayments = currentInvoice.get('payments');
      let paymentsToSave = [];
      currentInvoice.get('patient.payments').then(function(patientPayments) {
        patientPayments.forEach(function(payment) {
          let invoice = payment.get('invoice');
          if (Ember.isEmpty(invoice)) {
            payment.set('invoice', currentInvoice);
            paymentsToSave.push(payment.save());
            invoicePayments.addObject(payment);
          }
        }.bind(this));
        Ember.RSVP.all(paymentsToSave).then(function() {
          this.set('model.status', 'Billed');
          this.send('update');
        }.bind(this));
      }.bind(this));
    },

    printInvoice: function() {
      this.transitionToRoute('print.invoice', this.get('model'));
    },

    removePayment: function(removeInfo) {
      let payments = this.get('model.payments');
      let payment = removeInfo.itemToRemove;
      payment.set('invoice');
      payments.removeObject(removeInfo.itemToRemove);
      this.send('update', true);
      this.send('closeModal');
    },

    showAddLineItem: function() {
      let newLineItem = this.store.createRecord('billing-line-item', {
        id: uuid.v4()
      });
      this.send('openModal', 'invoices.add-line-item', newLineItem);
    },

    showDeleteItem: function(itemToDelete, deleteFrom) {
      this.showDeleteModal(itemToDelete, Ember.Object.create({
        confirmAction: 'deleteCharge',
        deleteFrom: deleteFrom,
        title: 'Delete Charge'
      }));
    },

    showDeleteLineItem: function(item) {
      this.showDeleteModal(item, Ember.Object.create({
        confirmAction: 'deleteLineItem',
        title: 'Delete Line Item'
      }));
    },

    showDeleteModal(item, options) {
      options = Ember.merge(options, Ember.Object.create({
        message: `Are you sure you want to delete ${item.get('name')}?`,
        itemToDelete: item,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
      this.send('openModal', 'dialog', options);
    },

    showRemovePayment: function(payment) {
      let message = 'Are you sure you want to remove this payment from this invoice?';
      let model = Ember.Object.create({
          itemToRemove: payment
        });
      let title = 'Remove Payment';
      this.displayConfirm(title, message, 'removePayment', model);
    },

    toggleDetails: function(item) {
      item.toggleProperty('showDetails');
    }
  },

  changePaymentProfile: function() {
    let patient = this.get('model.patient');
    let paymentProfile = this.get('model.paymentProfile');
    if (!Ember.isEmpty(patient) && Ember.isEmpty(paymentProfile)) {
      this.set('model.paymentProfile', patient.get('paymentProfile'));
    }
  }.observes('model.patient'),

  paymentProfileChanged: function() {
    let discountPercentage = this._getValidNumber(this.get('model.paymentProfile.discountPercentage'));
    let originalPaymentProfileId = this.get('model.originalPaymentProfileId');
    let profileId = this.get('model.paymentProfile.id');
    if (profileId !== originalPaymentProfileId) {
      let lineItems = this.get('model.lineItems');
      lineItems.forEach(function(lineItem) {
        let details = lineItem.get('details');
        let lineDiscount = 0;
        details.forEach(function(detail) {
          let pricingOverrides = detail.get('pricingItem.pricingOverrides');
          if (!Ember.isEmpty(pricingOverrides)) {
            let pricingOverride = pricingOverrides.findBy('profile.id', profileId);
            if (!Ember.isEmpty(pricingOverride)) {
              Ember.set(detail, 'price', pricingOverride.get('price'));
            }
          }
        }.bind(this));
        if (discountPercentage > 0) {
          let lineTotal = lineItem.get('total');
          lineDiscount = this._numberFormat((discountPercentage / 100) * (lineTotal), true);
          lineItem.set('discount', lineDiscount);
        }
      }.bind(this));
      this.set('model.originalPaymentProfileId', profileId);
    }
  }.observes('model.paymentProfile'),

  visitChanged: function() {
    let visit = this.get('model.visit');
    let lineItems = this.get('model.lineItems');
    if (!Ember.isEmpty(visit) && Ember.isEmpty(lineItems)) {
      this.set('model.originalPaymentProfileId');
      let promises = this.resolveVisitChildren();
      Ember.RSVP.allSettled(promises, 'Resolved visit children before generating invoice').then(function(results) {
        let chargePromises = this._resolveVisitDescendents(results, 'charges');
        if (!Ember.isEmpty(chargePromises)) {
          let promiseLabel = 'Reloaded charges before generating invoice';
          Ember.RSVP.allSettled(chargePromises, promiseLabel).then(function(chargeResults) {
            let pricingPromises = [];
            chargeResults.forEach(function(result) {
              if (!Ember.isEmpty(result.value)) {
                let pricingItem = result.value.get('pricingItem');
                if (!Ember.isEmpty(pricingItem)) {
                  pricingPromises.push(pricingItem.reload());
                }
              }
            });
            promiseLabel = 'Reloaded pricing items before generating invoice';
            Ember.RSVP.allSettled(pricingPromises, promiseLabel).then(function() {
              this._generateLineItems(visit, results);
              this.paymentProfileChanged();
            }.bind(this));
          }.bind(this));
        } else {
          this._generateLineItems(visit, results);
          this.paymentProfileChanged();
        }
      }.bind(this), function(err) {
        console.log('Error resolving visit children', err);
      });
    }
  }.observes('model.visit'),

  _addPharmacyCharge: function(charge, medicationItemName) {
    return charge.getMedicationDetails(medicationItemName).then((medicationDetails) => {
      let quantity = charge.get('quantity');
      let pharmacyCharges = this.get('pharmacyCharges');
      let pharmacyExpenseAccount = this.get('pharmacyExpenseAccount');
      let pharmacyCharge = this.store.createRecord('line-item-detail', {
        id: uuid.v4(),
        name: medicationDetails.name,
        quantity: quantity,
        price: medicationDetails.price,
        department: 'Pharmacy',
        expenseAccount: pharmacyExpenseAccount
      });
      pharmacyCharges.addObject(pharmacyCharge);
    });
  },

  _addSupplyCharge: function(charge, department) {
    let supplyCharges = this.get('supplyCharges');
    let supplyCharge = this._createChargeItem(charge, department);
    supplyCharges.addObject(supplyCharge);
  },

  _createChargeItem: function(charge, department) {
    let chargeItem = this.store.createRecord('line-item-detail', {
      id: uuid.v4(),
      name: charge.get('pricingItem.name'),
      expenseAccount: charge.get('pricingItem.expenseAccount'),
      quantity: charge.get('quantity'),
      price: charge.get('pricingItem.price'),
      department: department,
      pricingItem: charge.get('pricingItem')
    });
    return chargeItem;
  },

  /**
   * Remove the specified object from the specified list, update the model and close the modal.
   * @param objectToDelete {object} - the object to remove
   * @param deleteFrom {Array} - the array to remove the object from.
   */
  _deleteObject: function(objectToDelete, deleteFrom) {
    deleteFrom.removeObject(objectToDelete);
    if (!objectToDelete.get('isNew')) {
      objectToDelete.destroyRecord();
    }
    this.send('update', true);
    this.send('closeModal');
  },

  _mapWardCharge: function(charge) {
    return this._createChargeItem(charge, 'Ward');
  },

  _completeBeforeUpdate: function(sequence, resolve, reject) {
    let invoiceId = 'inv';
    let sequenceValue;
    sequence.incrementProperty('value', 1);
    sequenceValue = sequence.get('value');
    if (sequenceValue < 100000) {
      invoiceId += String(`00000${sequenceValue}`).slice(-5);
    } else {
      invoiceId += sequenceValue;
    }
    this.set('model.id', invoiceId);
    sequence.save().then(resolve, reject);
  },

  _generateLineItems: function(visit, visitChildren) {
    let endDate = visit.get('endDate');
    let imaging = visitChildren[0].value;
    let labs = visitChildren[1].value;
    let lineDetail, lineItem;
    let lineItems = this.get('model.lineItems');
    let medication = visitChildren[2].value;
    let procedures = visitChildren[3].value;
    let startDate = visit.get('startDate');
    let visitCharges = visit.get('charges');
    this.setProperties({
      pharmacyCharges: [],
      supplyCharges: [],
      wardCharges: []
    });
    if (!Ember.isEmpty(endDate) && !Ember.isEmpty(startDate)) {
      endDate = moment(endDate);
      startDate = moment(startDate);
      let stayDays = endDate.diff(startDate, 'days');
      if (stayDays > 1) {
        lineDetail = this.store.createRecord('line-item-detail', {
          id: uuid.v4(),
          name: 'Days',
          quantity: stayDays
        });
        lineItem = this.store.createRecord('billing-line-item', {
          id: uuid.v4(),
          category: 'Hospital Charges',
          name: 'Room/Accomodation'
        });
        lineItem.get('details').addObject(lineDetail);
        lineItems.addObject(lineItem);
      }
    }

    let pharmacyChargePromises = [];
    medication.forEach(function(medicationItem) {
      pharmacyChargePromises.push(this._addPharmacyCharge(medicationItem, 'inventoryItem'));
    }.bind(this));

    this.set('wardCharges', visitCharges.map(this._mapWardCharge.bind(this)));

    procedures.forEach(function(procedure) {
      let charges = procedure.get('charges');
      charges.forEach(function(charge) {
        if (charge.get('medicationCharge')) {
          pharmacyChargePromises.push(this._addPharmacyCharge(charge, 'medication'));
        } else {
          this._addSupplyCharge(charge, 'O.R.');
        }
      }.bind(this));
    }.bind(this));

    labs.forEach(function(lab) {
      if (!Ember.isEmpty(lab.get('labType'))) {
        this._addSupplyCharge(Ember.Object.create({
          pricingItem: lab.get('labType'),
          quantity: 1
        }), 'Lab');
      }
      lab.get('charges').forEach(function(charge) {
        this._addSupplyCharge(charge, 'Lab');
      }.bind(this));
    }.bind(this));

    imaging.forEach(function(imaging) {
      if (!Ember.isEmpty(imaging.get('imagingType'))) {
        this._addSupplyCharge(Ember.Object.create({
          pricingItem: imaging.get('imagingType'),
          quantity: 1
        }), 'Imaging');
      }
      imaging.get('charges').forEach(function(charge) {
        this._addSupplyCharge(charge, 'Imaging');
      }.bind(this));
    }.bind(this));

    Ember.RSVP.all(pharmacyChargePromises).then(() =>  {
      lineItem = this.store.createRecord('billing-line-item', {
        id: uuid.v4(),
        name: 'Pharmacy',
        category: 'Hospital Charges'
      });
      lineItem.get('details').addObjects(this.get('pharmacyCharges'));
      lineItems.addObject(lineItem);

      lineItem = this.store.createRecord('billing-line-item', {
        id: uuid.v4(),
        name: 'X-ray/Lab/Supplies',
        category: 'Hospital Charges'
      });
      lineItem.get('details').addObjects(this.get('supplyCharges'));
      lineItems.addObject(lineItem);

      lineItem = this.store.createRecord('billing-line-item', {
        id: uuid.v4(),
        name: 'Ward Items',
        category: 'Hospital Charges'
      });
      lineItem.get('details').addObjects(this.get('wardCharges'));
      lineItems.addObject(lineItem);

      lineItem = this.store.createRecord('billing-line-item', {
        id: uuid.v4(),
        name: 'Physical Therapy',
        category: 'Hospital Charges'
      });
      lineItems.addObject(lineItem);

      lineItem = this.store.createRecord('billing-line-item', {
        id: uuid.v4(),
        name: 'Others/Misc',
        category: 'Hospital Charges'
      });
      lineItems.addObject(lineItem);

      this.send('update', true);
    });
  },

  _resolveVisitDescendents: function(results, childNameToResolve) {
    let promises = [];
    results.forEach(function(result) {
      if (!Ember.isEmpty(result.value)) {
        result.value.forEach(function(record) {
          let children = record.get(childNameToResolve);
          if (!Ember.isEmpty(children)) {
            children.forEach(function(child) {
              // Make sure children are fully resolved
              promises.push(child.reload());
            });
          }
        });
      }
    });
    return promises;
  },

  beforeUpdate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let lineItems = this.get('model.lineItems');
      let savePromises = [];
      lineItems.forEach(function(lineItem) {
        lineItem.get('details').forEach(function(detail) {
          savePromises.push(detail.save());
        }.bind(this));
        savePromises.push(lineItem.save());
      }.bind(this));
      Ember.RSVP.all(savePromises, 'Saved invoice children before saving invoice').then(function() {
        if (this.get('model.isNew')) {
          this.store.find('sequence', 'invoice').then(function(sequence) {
            this._completeBeforeUpdate(sequence, resolve, reject);
          }.bind(this), function() {
            let store = this.get('store');
            let newSequence = store.push(store.normalize('sequence', {
              id: 'invoice',
              value: 0
            }));
            this._completeBeforeUpdate(newSequence, resolve, reject);
          }.bind(this));
        } else {
          resolve();
        }
      }.bind(this), reject);
    }.bind(this));
  },

  afterUpdate: function() {
    let message = 'The invoice record has been saved.';
    this.displayAlert('Invoice Saved', message);
  }
});
