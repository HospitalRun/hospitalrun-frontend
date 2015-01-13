import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import Ember from "ember";
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: ['imaging','pouchdb'],

    lookupListsToUpdate: [{
        name: 'imagingTypesList', //Name of property containing lookup list
        property: 'imagingType', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'imaging_types' //Id of the lookup list to update
    }],

    imagingTypesList: Ember.computed.alias('controllers.imaging.imagingTypesList'),    
    updateCapability: 'add_imaging',

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var newImaging = this.get('model');
            this.set('status', 'Requested');
            this.set('requestedBy', newImaging.getUserName());
            this.set('requestedDate', new Date());
            return this.addChildToVisit(newImaging, 'imaging', 'Imaging');    
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