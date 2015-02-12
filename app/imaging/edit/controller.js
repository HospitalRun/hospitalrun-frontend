import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
    needs: ['imaging','pouchdb'],
    chargePricingCategory: 'Imaging',
    chargeRoute: 'imaging.charge',
    
    canComplete: function() {
        return this.currentUserCan('complete_imaging');
    }.property(),

    newImagingType: false,
    
    actions: {
        completeImaging: function() {
            this.set('imagingDate', new Date());
            this.set('status', 'Completed');
            this.send('update');
        }
    },
    
    additionalButtons: function() {
        var canComplete = this.get('canComplete'),
            isValid = this.get('isValid');
        if (isValid && canComplete) {
            return [{
                buttonAction: 'completeImaging',
                buttonIcon: 'glyphicon glyphicon-ok',
                class: 'btn btn-primary on-white',
                buttonText: 'Complete'
            }];
        }
    }.property('canComplete', 'isValid'),

    pricingTypeForObjectType: 'Imaging Procedure',
    pricingTypes: Ember.computed.alias('controllers.imaging.imagingPricingTypes'),
    
    pricingList: null, //This gets filled in by the route

    
    showCharges: function() {
        var imagingType = this.get('imagingType'),
            patient = this.get('patient'),
            visit = this.get('visit');
        return (!Ember.isEmpty(imagingType) && !Ember.isEmpty(patient) && 
                !Ember.isEmpty(visit));            
    }.property('imagingType','patient', 'visit'),
    
    updateCapability: 'add_imaging',    
    
    selectedImagingTypeChanged: function() {
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
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this.updateCharges().then(function() {
                if (this.get('isNew')) {
                    var newImaging = this.get('model');
                    this.set('status', 'Requested');
                    this.set('requestedBy', newImaging.getUserName());
                    this.set('requestedDate', new Date());            
                    if (this.get('newImagingType')) {                        
                        this.saveNewPricing(this.get('imagingTypeName'), 'Imaging','imagingType').then(function() {
                            this.addChildToVisit(newImaging, 'imaging', 'Imaging').then(resolve, reject);
                        }.bind(this), reject);
                    } else {
                        return this.addChildToVisit(newImaging, 'imaging', 'Imaging').then(resolve, reject);
                    }
                } else {
                    resolve();
                }
            }.bind(this), reject);
        }.bind(this), 'beforeUpdate on imaging edit');
    }
    
});