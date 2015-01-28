import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
    needs: ['imaging','pouchdb'],
    chargeRoute: 'imaging.charge',
    
    canAddCharge: function() {        
        return this.currentUserCan('add_charge');
    }.property(),

    newImagingType: false,
    imagingTypesList: null, //This gets filled in by the route
    pricingList: null, //This gets filled in by the route
    updateCapability: 'add_imaging',
    
    selectedImagingTypeChangeds: function() {
        var selectedItem = this.get('selectedImagingType');
        if (!Ember.isEmpty(selectedItem)) {            
            this.store.find('pricing', selectedItem._id.substr(8)).then(function(item) {
                this.set('imagingType', item);
            }.bind(this));
        }
    }.observes('selectedImagingType'),
    
    imagingTypeChanged: function() {
        var imagingTypeName = this.get('imagingTypeName'),
            imagingType = this.get('imagingType');
        if (!Ember.isEmpty(imagingType)) {
            this.set('newImagingType', false);
            if (imagingType.get('name') !== imagingTypeName) {
                this.set('imagingTypeName', imagingType.get('name'));
            }
        } else {
            this.set('newImagingType', true);
        }
    }.observes('imagingType'),    

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var newImaging = this.get('model');
            this.set('status', 'Requested');
            this.set('requestedBy', newImaging.getUserName());
            this.set('requestedDate', new Date());            
            if (this.get('newImagingType')) {
                return new Ember.RSVP.Promise(function(resolve, reject) {
                    var newPricing = this.store.createRecord('pricing', {
                        name: this.get('imagingTypeName'),
                        category: 'Imaging'
                    });
                    newPricing.save().then(function() {
                        this.get('pricingList').addObject({
                            _id: 'pricing_'+ newPricing.get('id'),
                            name: newPricing.get('name')
                        });
                        this.set('imagingType', newPricing);
                        this.addChildToVisit(newImaging, 'imaging', 'Imaging').then(resolve, reject);
                    }.bind(this), reject);
                }.bind(this));
            } else {
                return this.addChildToVisit(newImaging, 'imaging', 'Imaging');
            }
        } else {
            if (this.get('isCompleting')) {
                this.set('imagingDate', new Date());
                this.set('status', 'Completed');
            }
            return Ember.RSVP.resolve();
        }
    },
    
    updateButtonText: function() {
        if (this.get('isCompleting')) {
            return 'Complete';
        } else if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew', 'isCompleting'),

});