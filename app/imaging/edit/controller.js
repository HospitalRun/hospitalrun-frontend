import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: 'imaging',

    lookupListsToUpdate: [{
        name: 'imagingTypesList', //Name of property containing lookup list
        property: 'imagingType', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'imaging_types' //Id of the lookup list to update
    }],

    imagingTypesList: Ember.computed.alias('controllers.imaging.imagingTypesList'),
    patientList: Ember.computed.alias('controllers.imaging.patientList'),
    patientVisits: Ember.computed.alias('patient.visits'),

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('dateRequested', new Date());
            return new Ember.RSVP.Promise(function(resolve, reject){
                var imaging = this.get('model'),
                    visit = this.get('visit'),
                    patient = this.get('patient'),
                    patientVisits = this.get('patientVisits'),
                    promises = [];
                this.set('status', 'Requested');
                this.set('requestedBy', imaging.getUserName());
                this.set('requestedDate', new Date());
                if (Ember.isEmpty(visit)) {
                    visit = this.get('store').createRecord('visit', {
                        startDate: new Date(),
                        endDate: new Date(),
                        patient: patient,
                        visitType: 'Imaging'
                    });
                    this.set('visit', visit);
                    patientVisits.addObject(visit);
                    promises.push(patient.save());
                }
                visit.get('imaging').then(function(visitImaging) {
                    visitImaging.addObject(imaging);
                    promises.push(visit.save());
                    Ember.RSVP.all(promises, 'All updates done for imaging visit before imaging save').then(function() {        
                        resolve();
                    }.bind(this), reject);
                }.bind(this));                    
            }.bind(this));            
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