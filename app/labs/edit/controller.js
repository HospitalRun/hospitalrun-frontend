import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: 'labs',

    lookupListsToUpdate: [{
        name: 'labTypesList', //Name of property containing lookup list
        property: 'labType', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'lab_types' //Id of the lookup list to update
    }],

    labTypesList: Ember.computed.alias('controllers.labs.labTypesList'),
    patientList: Ember.computed.alias('controllers.labs.patientList'),
    visitList: Ember.computed.alias('controllers.labs.visitList'),

    updateCapability: 'add_lab',

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var newLab = this.get('model');
            this.set('status', 'Requested');
            this.set('requestedBy', newLab.getUserName());
            this.set('requestedDate', new Date());
            return this.addChildToVisit(newLab, 'labs', 'Lab');            
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