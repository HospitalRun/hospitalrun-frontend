import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
    needs: ['labs','pouchdb'],
    chargePricingCategory: 'Lab',
    chargeRoute: 'labs.charge',

    newLabType: false,
    
    pricingList: null, //This gets filled in by the route
    pricingTypeForObjectType: 'Lab Procedure',
    updateCapability: 'add_lab',
    
    selectedLabTypeChanged: function() {
        var selectedItem = this.get('selectedLabType');
        if (!Ember.isEmpty(selectedItem)) {            
            this.store.find('pricing', selectedItem._id.substr(8)).then(function(item) {
                this.set('labType', item);
            }.bind(this));
        }
    }.observes('selectedLabType'),
    
    labTypeChanged: function() {
        var labTypeName = this.get('labTypeName'),
            labType = this.get('labType');
        if (!Ember.isEmpty(labType)) {
            this.set('newLabType', false);
            if (labType.get('name') !== labTypeName) {
                this.set('labTypeName', labType.get('name'));
            }
        } else {
            this.set('newLabType', true);
        }
    }.observes('labType'),    

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var newLab = this.get('model');
            this.set('status', 'Requested');
            this.set('requestedBy', newLab.getUserName());
            this.set('requestedDate', new Date());
            
            if (this.get('newLabType')) {
                return new Ember.RSVP.Promise(function(resolve, reject) {
                    var newPricing = this.store.createRecord('pricing', {
                        name: this.get('labTypeName'),
                        category: 'Lab',
                        type: 'Lab Procedure'
                    });
                    newPricing.save().then(function() {
                        this.get('pricingList').addObject({
                            _id: 'pricing_'+ newPricing.get('id'),
                            name: newPricing.get('name')
                        });
                        this.set('labType', newPricing);
                        this.addChildToVisit(newLab, 'labs', 'Lab').then(resolve, reject);
                    }.bind(this), reject);
                }.bind(this));
            } else {
                return this.addChildToVisit(newLab, 'labs', 'Lab');
            }
        } else {
            if (this.get('isCompleting')) {
                this.set('labDate', new Date());
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