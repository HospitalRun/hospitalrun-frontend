import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(VisitTypes, {
    needs: 'visits',
    
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
    patient: Ember.computed.alias('model.patient'),
    patientId: Ember.computed.alias('patient.id'),
    patientVisits: Ember.computed.alias('patient.visits'),
    
    patientIdChanged: function() {
        var patientId = this.get('patientId');
        if (!Ember.isEmpty(patientId)) {
            this.set('returnPatientId', patientId);
        }
    }.observes('patientId').on('init'),
    
    returnPatientId: null,

    afterUpdate: function() {
        this.send('returnToPatient');
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            return new Ember.RSVP.Promise(function(resolve){
                this.get('patientVisits').then(function(patientVisits){
                    var visit = this.get('model');
                    patientVisits.addObject(visit);
                    var patient = this.get('patient');
                    patient.save().then(resolve);
                }.bind(this));
            }.bind(this));
        } else {
            Ember.RSVP.resolve();
        }
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
        
        returnToPatient: function() {
            this.transitionToRoute('patients.edit', this.get('returnPatientId'));
        },
        
        showAddVitals: function() {
            var newVitals = this.get('store').createRecord('vital', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'visits.vitals.edit', newVitals);
        },
        
        showAddProcedure: function() {
            var newProcedure = this.get('store').createRecord('procedure', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'visits.procedures.edit', newProcedure);
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
