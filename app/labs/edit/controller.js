import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
    needs: ['labs','pouchdb'],
    chargePricingCategory: 'Lab',
    chargeRoute: 'labs.charge',

    
    canComplete: function() {
        return this.currentUserCan('complete_lab');
    }.property(),
    
    actions: {
        completeLab: function() {
            this.set('status', 'Completed');
            this.get('model').validate();
            if (this.get('isValid')) {
                this.set('labDate', new Date());
                this.send('update');
            }
        }
    },
    
    additionalButtons: function() {
        var canComplete = this.get('canComplete'),
            isValid = this.get('isValid');
        if (isValid && canComplete) {
            return [{
                buttonAction: 'completeLab',
                buttonIcon: 'glyphicon glyphicon-ok',
                class: 'btn btn-primary on-white',
                buttonText: 'Complete'
            }];
        }
    }.property('canComplete', 'isValid'),

    pricingTypeForObjectType: 'Lab Procedure',
    pricingTypes: Ember.computed.alias('controllers.labs.labPricingTypes'),
    
    pricingList: null, //This gets filled in by the route
    
    labTypeChanged: function() {
        this.objectTypeChanged('labTypeName', 'labType');
    }.observes('labType'),
    
    labTypeNameChanged: function() {
        this.objectTypeNameChanged('labTypeName', 'selectedLabType');
    }.observes('labTypeName'),
    
    showCharges: function() {
        var labType = this.get('labType'),
            patient = this.get('patient'),
            visit = this.get('visit');
        return (!Ember.isEmpty(labType) && !Ember.isEmpty(patient) && 
                !Ember.isEmpty(visit));            
    }.property('labType','patient', 'visit'),
    
    updateCapability: 'add_lab',
    
    selectedLabTypeChanged: function() {
        this.selectedObjectTypeChanged('selectedLabType', 'labType'); 
    }.observes('selectedLabType'),
    
    afterUpdate: function() {
        var alertMessage,
            alertTitle;            
        if (this.get('status') === 'Completed') {
            alertTitle = 'Lab Request Completed';
            alertMessage = 'The lab request has been completed.';
        } else {
            alertTitle = 'Lab Request Saved';
            alertMessage = 'The lab request has been saved.';
        }
        this.saveVisitIfNeeded(alertTitle, alertMessage);
    },
    
    beforeUpdate: function() {
        if (!this.get('isValid')) {
            return Ember.RSVP.reject();
        }
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this.updateCharges().then(function() {
                if (this.get('isNew')) {
                    var newLab = this.get('model');
                    this.set('status', 'Requested');
                    this.set('requestedBy', newLab.getUserName());
                    this.set('requestedDate', new Date());
                    if (this.get('newObjectType')) {
                        this.saveNewPricing(this.get('labTypeName'), 'Lab', 'labType').then(function() {
                            this.addChildToVisit(newLab, 'labs', 'Lab').then(resolve, reject);
                        }.bind(this), reject);
                    } else {
                        return this.addChildToVisit(newLab, 'labs', 'Lab').then(resolve, reject);
                    }
                } else {
                    resolve();
                }
            }.bind(this), reject);
        }.bind(this), 'beforeUpdate on lab edit');
    }
    
});