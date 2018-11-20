import { isArray } from '@ember/array';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';

import {
  Promise as EmberPromise,
  all,
  resolve
} from 'rsvp';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  chargePricingCategory: null,
  pricingList: null,
  pricingTypeForObjectType: null,
  pricingTypes: null,
  _createNewChargeRecord(quantityCharged, pricingId) {
    return new EmberPromise(function(resolve, reject) {
      this.store.find('pricing', pricingId).then(function(item) {
        let newCharge = this.store.createRecord('proc-charge', {
          dateCharged: new Date(),
          quantity: quantityCharged,
          pricingItem: item
        });
        newCharge.save().then(function(chargeRecord) {
          let charges = this.get('model.charges');
          charges.addObject(chargeRecord);
          resolve();
        }.bind(this), reject);
      }.bind(this), reject);
    }.bind(this), `_createNewChargeRecord with pricingId:${pricingId}`);
  },

  actions: {
    addCharge(charge) {
      let charges = this.get('model.charges');
      charges.addObject(charge);
      let from = `addCharge_${charge.get('id')}`;
      if (charge.get('medicationCharge')) {
        from = `addMedication_${charge.get('id')}`;
      }
      this.silentUpdate('closeModal', from);
    },

    deleteCharge(model) {
      let chargeToDelete = model.get('chargeToDelete');
      let charges = this.get('model.charges');
      charges.removeObject(chargeToDelete);
      chargeToDelete.destroyRecord().then(() => {
        this.silentUpdate('closeModal', 'deleteCharge');
      });
    },

    showAddCharge() {
      let newCharge = this.get('store').createRecord('proc-charge', {
        dateCharged: new Date(),
        quantity: 1,
        pricingCategory: this.get('chargePricingCategory')
      });
      this.send('openModal', this.get('chargeRoute'), newCharge);
    },

    showEditCharge(charge) {
      charge.set('itemName', charge.get('pricingItem.name'));
      charge.set('pricingCategory', this.get('chargePricingCategory'));
      this.send('openModal', this.get('chargeRoute'), charge);
    },

    showDeleteCharge(charge) {
      this.send('openModal', 'dialog', EmberObject.create({
        closeModalOnConfirm: false,
        confirmAction: 'deleteCharge',
        title: 'Delete Charge Item',
        message: 'Are you sure you want to delete this charged item?',
        chargeToDelete: charge,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('intl').t('buttons.ok')
      }));
    },

    setChargeQuantity(id, quantity) {
      let model = this.get('model');
      model.set(id, quantity);
    }
  },

  canAddCharge: computed(function() {
    return this.currentUserCan('add_charge');
  }),

  chargeRoute: null,

  findChargeForPricingItem(pricingItem, charges) {
    let chargeForItem = charges.find(function(charge) {
      let chargePricingItemId = charge.get('pricingItem.id');
      return (pricingItem.id === chargePricingItemId);
    });
    return chargeForItem;
  },
  /**
   * Returns object types out of the pricing list.
   * Used for labs and imaging where the labs and imaging types are
   * directly in the price list.
   */
  objectTypeList: computed('pricingList', 'pricingTypeForObjectType', 'pricingTypeValues', function() {
    let pricingList = this.get('pricingList');
    let userCanAddPricingTypes = this.get('userCanAddPricingTypes');
    let returnList = EmberObject.create({
      value: [],
      userCanAdd: userCanAddPricingTypes
    });
    if (!isEmpty(pricingList)) {
      returnList.set('value', pricingList);
    }
    return returnList;
  }),

  organizeByType: alias('pricingTypes.organizeByType'),

  pricingTypeList: computed('pricingTypeValues', 'pricingTypeForObjectType', 'pricingList', function() {
    let pricingList = this.get('pricingList');
    let pricingTypeValues = this.get('pricingTypeValues');
    let pricingTypeForObjectType = this.get('pricingTypeForObjectType');
    if (!isEmpty(pricingTypeValues)) {
      pricingTypeValues = pricingTypeValues.filter(function(pricingType) {
        let havePricing = false;
        if (!isEmpty(pricingList)) {
          havePricing = !isEmpty(pricingList.findBy('pricingType', pricingType));
        }
        return havePricing && pricingType !== pricingTypeForObjectType;
      });
      pricingTypeValues = pricingTypeValues.sortBy('name');
      return pricingTypeValues;
    }
  }),

  pricingTypeValues: alias('pricingTypes.value'),

  /**
   * Create multiple new request records from the pricing records passed in.  This function
   * will also add those new records to the specified visit.
   * @param {array} pricingRecords the list of pricing records to use to create request records from.
   * @param {string} pricingField the name of the field on the request record to set the pricing record on.
   * @param {string} visitChildName the name of the child object on the visit to add to.
   * @param {string} newVisitType if a new visit needs to be created, what type of visit
   * should be created.
   */
  createMultipleRequests(pricingRecords, pricingField, visitChildName, newVisitType) {
    let firstRecord = pricingRecords.get('firstObject');
    let modelToSave = this.get('model');
    modelToSave.set(pricingField, firstRecord);
    this.addChildToVisit(modelToSave, visitChildName, newVisitType).then(function(visit) {
      modelToSave.save().then(function() {
        this._finishCreateMultipleRequests(pricingRecords, pricingField, visitChildName, newVisitType, visit);
      }.bind(this));
    }.bind(this));
  },

  _finishCreateMultipleRequests(pricingRecords, pricingField, visitChildName, newVisitType, visit) {
    let attributesToSave = {};
    let baseModel = this.get('model');
    let modelToSave;
    let modelsToAdd = [];
    let patient = this.get('model.patient');
    let savePromises = [];

    baseModel.eachAttribute(function(name) {
      attributesToSave[name] = baseModel.get(name);
    });

    pricingRecords.forEach(function(pricingRecord, index) {
      if (index > 0) {
        modelToSave = this.store.createRecord(newVisitType.toLowerCase(), attributesToSave);
        modelToSave.set(pricingField, pricingRecord);
        modelToSave.set('patient', patient);
        modelToSave.set('visit', visit);
        modelsToAdd.push(modelToSave);
        savePromises.push(modelToSave.save());
      }
    }.bind(this));

    all(savePromises).then(function() {
      let addPromises = [];
      modelsToAdd.forEach(function(modelToSave) {
        addPromises.push(this.addChildToVisit(modelToSave, visitChildName, newVisitType));
      }.bind(this));
      all(addPromises).then(function(addResults) {
        this.afterUpdate(addResults, true);
      }.bind(this));
    }.bind(this));
  },

  saveNewPricing(pricingName, pricingCategory, priceObjectToSet) {
    return new EmberPromise(function(resolve, reject) {
      let newPricing;
      let pricingTypeForObjectType = this.get('pricingTypeForObjectType');
      newPricing = this.store.createRecord('pricing', {
        name: pricingName,
        category: pricingCategory,
        pricingType: pricingTypeForObjectType
      });
      newPricing.save().then(function(savedNewPricing) {
        this.get('pricingList').addObject({
          id: savedNewPricing.get('id'),
          name: newPricing.get('name')
        });
        this.set(priceObjectToSet, newPricing);
        resolve();
      }.bind(this), reject);
    }.bind(this), `saveNewPricing for: ${pricingName}`);
  },

  getSelectedPricing(selectedField) {
    let selectedItem = this.get(selectedField);
    if (!isEmpty(selectedItem)) {
      return new EmberPromise(function(resolve, reject) {
        if (isArray(selectedItem)) {
          this.store.findByIds('pricing', selectedItem).then(resolve, reject);
        } else {
          this.store.find('pricing', selectedItem.id).then(resolve, reject);
        }
      }.bind(this));
    } else {
      return resolve();
    }
  },

  showAddCharge: computed('canAddCharge', 'organizeByType', function() {
    let canAddCharge = this.get('canAddCharge');
    let organizeByType = this.get('organizeByType');
    if (canAddCharge) {
      return !organizeByType;
    } else {
      return false;
    }
  }),

  showEditCharges: computed('canAddCharge', 'organizeByType', function() {
    let canAddCharge = this.get('canAddCharge');
    let organizeByType = this.get('organizeByType');
    if (canAddCharge) {
      return organizeByType;
    } else {
      return false;
    }
  }),

  showPricingTypeTabs: computed('pricingTypeList', function() {
    let pricingTypeList = this.get('pricingTypeList');
    return !isEmpty(pricingTypeList) && pricingTypeList.get('length') > 1;
  }),

  userCanAddPricingTypes: computed('pricingTypes', function() {
    let pricingTypes = this.get('pricingTypes');
    if (isEmpty(pricingTypes)) {
      return true;
    } else {
      return pricingTypes.get('userCanAdd');
    }
  }),

  /**
   * When using organizeByType charges need to be mapped over from the price lists
   */
  updateCharges() {
    let organizeByType = this.get('organizeByType');
    if (!organizeByType) {
      return resolve();
    }
    return new EmberPromise(function(resolve, reject) {
      let charges = this.get('model.charges');
      let chargePromises = [];
      let model = this.get('model');
      let pricingList = this.get('pricingList');
      pricingList.forEach(function(pricingItem) {
        let currentCharge = this.findChargeForPricingItem(pricingItem, model.get('charges'));
        let quantityCharged = model.get(pricingItem.id);
        if (isEmpty(quantityCharged)) {
          if (currentCharge) {
            // Remove existing charge because quantity is blank
            charges.removeObject(currentCharge);
            chargePromises.push(currentCharge.destroyRecord());
          }
        } else {
          if (currentCharge) {
            if (currentCharge.get('quantity') !== quantityCharged) {
              currentCharge.set('quantity', quantityCharged);
              chargePromises.push(currentCharge.save());
            }
          } else {
            chargePromises.push(this._createNewChargeRecord(quantityCharged, pricingItem.id));
          }
        }
      }.bind(this));
      all(chargePromises, `Charges updated for current record: ${this.get('model.id')}`).then(resolve, reject);
    }.bind(this), `updateCharges for current record: ${this.get('model.id')}`);
  }
});
