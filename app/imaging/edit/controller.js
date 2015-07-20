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
    
    actions: {
        completeImaging: function() {
            this.set('status', 'Completed');
            this.get('model').validate();
            if (this.get('isValid')) {
                this.set('imagingDate', new Date());
                this.send('update');
            }
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
    
    lookupListsToUpdate: [{
        name: 'radiologistList',
        property: 'radiologist',
        id: 'radiologists'
    }],
    
    pricingTypeForObjectType: 'Imaging Procedure',
    pricingTypes: Ember.computed.alias('controllers.imaging.imagingPricingTypes'),
    
    pricingList: null, //This gets filled in by the route
    
    radiologistList: Ember.computed.alias('controllers.imaging.radiologistList'),
    
    imagingTypeChanged: function() {
        this.objectTypeChanged('imagingTypeName', 'imagingType');
    }.observes('imagingType'),
    
    imagingTypeNameChanged: function() {
        this.objectTypeNameChanged('imagingTypeName', 'selectedImagingType');
    }.observes('imagingTypeName'),
    
    showCharges: function() {
        var imagingType = this.get('imagingType'),
            patient = this.get('patient'),
            visit = this.get('visit');
        return (!Ember.isEmpty(imagingType) && !Ember.isEmpty(patient) && 
                !Ember.isEmpty(visit));            
    }.property('imagingType','patient', 'visit'),
    
    updateCapability: 'add_imaging',    
    
    selectedImagingTypeChanged: function() {
        this.selectedObjectTypeChanged('selectedImagingType', 'imagingType'); 
    }.observes('selectedImagingType'),
    
    afterUpdate: function() {
         var alertTitle,
            alertMessage;
        if (this.get('status') === 'Completed') {
            alertTitle = 'Imaging Request Completed';
            alertMessage = 'The imaging request has been completed.';
        } else {
            alertTitle = 'Imaging Request Saved';
            alertMessage = 'The imaging request has been saved.';
        }
        this.saveVisitIfNeeded(alertTitle, alertMessage);
        this.set('selectPatient', false);
    },
    
    beforeUpdate: function() {
        if (!this.get('isValid')) {
            return Ember.RSVP.reject();
        }
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this.updateCharges().then(function() {
                if (this.get('isNew')) {
                    var newImaging = this.get('model');
                    this.set('status', 'Requested');
                    this.set('requestedBy', newImaging.getUserName());
                    this.set('requestedDate', new Date());            
                    if (this.get('newObjectType')) {                        
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