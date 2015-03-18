import Ember from 'ember';
export default Ember.Mixin.create({
    _createNewChargeRecord: function(quantityCharged, pricingId) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this.store.find('pricing', pricingId.substr(8)).then(function(item) {
                var newCharge = this.store.createRecord('proc-charge', {
                    dateCharged: new Date(),
                    quantity: quantityCharged,
                    pricingItem: item,
                });
                newCharge.save().then(function(chargeRecord) {
                    var charges = this.get('charges');
                    charges.addObject(chargeRecord);
                    resolve();
                }.bind(this), reject);
            }.bind(this), reject);            
        }.bind(this), '_createNewChargeRecord with pricingId:'+pricingId);
    },
    
    actions: {
        addCharge: function(charge) {
            var charges = this.get('charges');
            charges.addObject(charge);
            this.send('update', true);
            this.send('closeModal');
        },
        
        deleteCharge: function(model) {
            var chargeToDelete = model.get('chargeToDelete'),
                charges = this.get('charges');
            charges.removeObject(chargeToDelete);
            chargeToDelete.destroyRecord();
            this.send('update', true);
            this.send('closeModal');
        },
        
        showAddCharge: function() {
            var newCharge = this.get('store').createRecord('proc-charge',{
                dateCharged: new Date(),
                quantity: 1,
                pricingCategory: this.get('chargePricingCategory')
            });
            this.send('openModal', this.get('chargeRoute'), newCharge);
        },
        
        showEditCharge: function(charge) {
            charge.set('pricingCategory', this.get('chargePricingCategory'));
            this.send('openModal', this.get('chargeRoute'), charge);            
        },
        
        showDeleteCharge: function(charge) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteCharge',
                title: 'Delete Charge Item',
                message: 'Are you sure you want to delete this charged item?',
                chargeToDelete: charge,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));                 
        }
    },
    
    canAddCharge: function() {
        return this.currentUserCan('add_charge');
    }.property(),
    
    /**
     * Returns pricing list without object types
     * Used for labs and imaging where the labs and imaging types are
     * directly in the price list.
     */
    chargesPricingList: function() {
        var pricingList = this.get('pricingList'),
            pricingTypeForObjectType = this.get('pricingTypeForObjectType');
        return pricingList.filter(function(item) {
            return (item.type !== pricingTypeForObjectType);
        });
    }.property('pricingList','pricingTypeForObjectType'),

    
    chargeRoute: null,
    
    findChargeForPricingItem: function(pricingItem) {
        var charges = this.get('charges'),
            chargeForItem = charges.find(function(charge) {
                var chargePricingItemId = charge.get('pricingItem.id');
                return (pricingItem._id.substr(8) === chargePricingItemId);
            });
        return chargeForItem;
    },
    
    newObjectType: false,
    
    objectTypeChanged: function(objectTypeNameField, typeField) {
        var isNew = this.get('isNew'),
            objectTypeName = this.get(objectTypeNameField),
            objectType = this.get(typeField);
        if (isNew) {
            if(objectTypeName instanceof Object) {
               this.set('newObjectType', false);
            } else {
                if (!Ember.isEmpty(objectType)) {
                    this.set('newObjectType', false);
                    if (objectType.get('name') !== objectTypeName) {
                        this.set(objectTypeNameField, objectType.get('name'));
                    }
                } else {
                    this.set('newObjectType', true);
                }
            }
        }
    },

    /**
     * Returns object types out of the pricing list.
     * Used for labs and imaging where the labs and imaging types are
     * directly in the price list.
     */
    objectTypeList: function() {
        var pricingList = this.get('pricingList'),            
            pricingTypeForObjectType = this.get('pricingTypeForObjectType'),
            userCanAddPricingTypes = this.get('userCanAddPricingTypes'),
            returnList = Ember.Object.create({
                value: [],
                userCanAdd: userCanAddPricingTypes
            });        
        if (!Ember.isEmpty(pricingList)) {
            returnList.set('value', pricingList.filterBy('type', pricingTypeForObjectType));
        }
        return returnList;
    }.property('pricingList','pricingTypeForObjectType','pricingTypeValues'),
    
    objectTypeNameChanged: function(objectTypeNameField, selectedField) {
        var isNew = this.get('isNew'),
            objectTypeName = this.get(objectTypeNameField);
        if (isNew && objectTypeName instanceof Object) {
            this.set(selectedField, objectTypeName);
        }
    },
    
    organizeByType: Ember.computed.alias('pricingTypes.organizeByType'),
        
    pricingTypeList: function() {
        var pricingTypeValues = this.get('pricingTypeValues'),
            pricingTypeForObjectType = this.get('pricingTypeForObjectType');
        pricingTypeValues = pricingTypeValues.filter(function(pricingType) {
            return pricingType !== pricingTypeForObjectType;
        });
        pricingTypeValues = pricingTypeValues.sortBy('name');
        return pricingTypeValues;
    }.property('pricingTypeValues','pricingTypeForObjectType'),
    
    pricingTypeValues: Ember.computed.alias('pricingTypes.value'),
    
    saveNewPricing: function(pricingName, pricingCategory, priceObjectToSet) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var newPricing,
                pricingTypeForObjectType = this.get('pricingTypeForObjectType');
            newPricing = this.store.createRecord('pricing', {
                name: pricingName,
                category: pricingCategory,
                type: pricingTypeForObjectType
            });
            newPricing.save().then(function() {
                this.get('pricingList').addObject({
                    _id: 'pricing_'+ newPricing.get('id'),
                    name: newPricing.get('name')
                });
                this.set(priceObjectToSet, newPricing);
                resolve();
            }.bind(this), reject);
        }.bind(this), 'saveNewPricing for: '+pricingName);        
    },
       
    selectedObjectTypeChanged: function(selectedField, typeField) {
        var isNew = this.get('isNew'),
            selectedItem = this.get(selectedField);
        if (isNew) {
            if (!Ember.isEmpty(selectedItem)) {            
                this.store.find('pricing', selectedItem._id.substr(8)).then(function(item) {
                    this.set(typeField, item);
                }.bind(this));
            } else {
               this.set(typeField);
            }
        }
    },
  
    showAddCharge: function() {
        var canAddCharge = this.get('canAddCharge'), 
            organizeByType = this.get('organizeByType');
        if (canAddCharge) {
            return !organizeByType;
        } else {
            return false;
        }
    }.property('canAddCharge', 'organizeByType'),
    
    showEditCharges: function() {
        var canAddCharge = this.get('canAddCharge'), 
            organizeByType = this.get('organizeByType');
        if (canAddCharge) {
            return organizeByType;
        } else {
            return false;
        }
    }.property('canAddCharge', 'organizeByType'),

    showPricingTypeTabs: function() {
        var pricingTypeList = this.get('pricingTypeList');
        return (!Ember.isEmpty(pricingTypeList) && pricingTypeList.get('length') > 1);
    }.property('pricingTypeList'),
    
    userCanAddPricingTypes: Ember.computed.alias('pricingTypes.userCanAdd'),
    
    /**
     * When using organizeByType charges need to be mapped over from the price lists
     */
    updateCharges: function() {
        var charges = this.get('charges'),
            organizeByType = this.get('organizeByType'),
            pricingList = this.get('pricingList');
        
        if (!organizeByType) {
            return Ember.RSVP.resolve();
        }
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var chargePromises = [];
            pricingList.forEach(function(pricingItem) {
                var currentCharge = this.findChargeForPricingItem(pricingItem),
                    quantityCharged = this.get(pricingItem._id);
                if (Ember.isEmpty(quantityCharged)) {
                    if (currentCharge) {
                        //Remove existing charge because quantity is blank
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
                        chargePromises.push(this._createNewChargeRecord(quantityCharged, pricingItem._id));
                    }
                }                
            }.bind(this));
            Ember.RSVP.all(chargePromises, 'Charges updated for current record:'+this.get('id')).then(resolve,reject);
        }.bind(this), 'updateCharges for current record:'+this.get('id'));
    }
});