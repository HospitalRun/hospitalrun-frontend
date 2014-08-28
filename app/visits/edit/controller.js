import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from "hospitalrun/mixins/user-session";
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(PatientSubmodule, UserSession, VisitTypes, {
    needs: 'visits',
    
    canAddImaging: function() {
        return this.currentUserCan('add_imaging');
    }.property(),    

    canAddLab: function() {        
        return this.currentUserCan('add_lab');
    }.property(),    
    
    canAddMedication: function() {        
        return this.currentUserCan('add_medication');
    }.property(),

    canAddProcedure: function() {        
        return this.currentUserCan('add_procedure');
    }.property(),
    
    canAddVitals: function() {        
        return this.currentUserCan('add_vitals');
    }.property(),    
    
    canDeleteImaging: function() {
        return this.currentUserCan('delete_imaging');
    }.property(),        
    
    canDeleteLab: function() {        
        return this.currentUserCan('delete_lab');
    }.property(),        
    
    canDeleteMedication: function() {        
        return this.currentUserCan('delete_medication');
    }.property(),

    canDeleteProcedure: function() {        
        return this.currentUserCan('delete_procedure');
    }.property(),
    
    canDeleteVitals: function() {        
        return this.currentUserCan('delete_vitals');
    }.property(),
    
    
    cancelAction: 'returnToPatient',
    clinicList: Ember.computed.alias('controllers.visits.clinicList'),
    physicianList: Ember.computed.alias('controllers.visits.physicianList'),
    locationList: Ember.computed.alias('controllers.visits.locationList'),
    lookupListsToUpdate: [{
        name: 'clinicList',
        property: 'clinic',
        id: 'clinic_list'
    }, {
        name: 'physicianList',
        property: 'examiner',
        id: 'physician_list'
    }, {
        name: 'locationList',
        property: 'location',
        id: 'location_list'
    }],
    
    newVisit: false,

    patientVisits: Ember.computed.alias('patient.visits'),
    updateCapability: 'add_visit',

    afterUpdate: function(visit) {
        if (this.get('newVisit')) {
            var visits = this.get('patientVisits'),
                patient = this.get('patient');
            visits.addObject(visit);
            patient.save().then(function() {
                this.send('returnToPatient');
            }.bind(this));
        } else {
            this.send('returnToPatient');
        }
    },
    
    beforeUpdate: function() {        
        if (this.get('isNew')) {
            this.set('newVisit', true);
        }
        return Ember.RSVP.resolve();
    },
    
    /**
     * Adds or removes the specified object from the specified list.
     * @param {String} listName The name of the list to operate on.
     * @param {Object} listObject The object to add or removed from the
     * specified list.
     * @param {boolean} removeObject If true remove the object from the list;
     * otherwise add the specified object to the list.
     */
    updateList: function(listName, listObject, removeObject) {
        var list = this.get(listName);
        if (removeObject) {
            list.removeObject(listObject);
        } else {
            list.addObject(listObject);
        }
        this.send('update', true);
        this.send('closeModal');
    },
    
    actions: {
        addProcedure: function(newProcedure) {
            this.updateList('procedures', newProcedure);
        },
        
        addVitals: function(newVitals) {
            this.updateList('vitals', newVitals);
        },
        
        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send(this.get('cancelAction'));
        },
        
        deleteProcedure: function(procedure) {
            this.updateList('procedures', procedure, true);
        },
        
        deleteVitals: function(vitals) {
            this.updateList('vitals', vitals, true);
        },
        
        editImaging: function(imaging) {
            imaging.setProperties({
                'isCompleting': false,
                'returnToVisit': true
            });
            this.transitionToRoute('imaging.edit', imaging);
        },        
        
        editLab: function(lab) {
            lab.setProperties({
                'isCompleting': false,
                'returnToVisit': true
            });
            this.transitionToRoute('labs.edit', lab);
        },
        
        editMedication: function(medication) {
            medication.set('returnToVisit', true);
            this.transitionToRoute('medication.edit', medication);
        },
        
        showAddVitals: function() {
            var newVitals = this.get('store').createRecord('vital', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'visits.vitals.edit', newVitals);
        },
        
        newImaging: function() {
            var newImaging = this.get('store').createRecord('imaging', {
                isCompleting: false,
                patient: this.get('patient'),
                visit: this.get('model'),
                returnToVisit: true
            });            
            this.transitionToRoute('imaging.edit', newImaging);
        },

        newLab: function() {
            var newLab = this.get('store').createRecord('lab', {
                isCompleting: false,
                patient: this.get('patient'),
                visit: this.get('model'),
                returnToVisit: true
            });            
            this.transitionToRoute('labs.edit', newLab);
        },        

        newMedication: function() {
            var newMedication = this.get('store').createRecord('medication', {
                prescriptionDate: moment().startOf('day').toDate(),
                patient: this.get('patient'),
                visit: this.get('model'),
                returnToVisit: true
            });            
            this.transitionToRoute('medication.edit', newMedication);
        },
        
        showAddProcedure: function() {
            var newProcedure = this.get('store').createRecord('procedure', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'visits.procedures.edit', newProcedure);
        },

        showDeleteImaging: function(imaging) {
            this.send('openModal', 'imaging.delete', imaging);
        },

        showDeleteLab: function(lab) {
            this.send('openModal', 'labs.delete', lab);
        },
        
        showDeleteMedication: function(medication) {
            this.send('openModal', 'medication.delete', medication);
        },    
        
        showDeleteProcedure: function(procedure) {
            this.send('openModal', 'visits.procedures.delete', procedure);
        },
        
        showDeleteVitals: function(vitals) {
            this.send('openModal', 'visits.vitals.delete', vitals);
        },

        showEditProcedure: function(procedure) {
            this.send('openModal', 'visits.procedures.edit', procedure);
        },
        
        showEditVitals: function(vitals) {
            this.send('openModal', 'visits.vitals.edit', vitals);
        }
    }
});
