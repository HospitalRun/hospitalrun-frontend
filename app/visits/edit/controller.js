import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AddDiagnosisModel from 'hospitalrun/models/add-diagnosis';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from "ember";
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from "hospitalrun/mixins/user-session";
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, UserSession, VisitTypes, {
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
    
    canAddDiagnosis: function() {        
        return this.currentUserCan('add_diagnosis');
    }.property(),    

    canAddProcedure: function() {        
        return this.currentUserCan('add_procedure');
    }.property(),
    
    canAddVitals: function() {        
        return this.currentUserCan('add_vitals');
    }.property(),
    
    canDeleteDiagnosis: function() {        
        return this.currentUserCan('delete_diagnosis');
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
    
    dateFormat: function() {
        if (this.get('isAdmissionVisit')) {
            return 'l h:mm A';
        } else {
            return 'l';
        }
    }.property('isAdmissionVisit'),

    endDateLabel: function() {
        if (this.get('isAdmissionVisit')) {
            return 'Discharge Date';
        } else {
            return 'End Date';
        }
    }.property('isAdmissionVisit'),
    
    isAdmissionVisit: function() {
        var visitType = this.get('visitType');
        return (visitType === 'Admission');
    }.property('visitType'),
    
    startDateLabel: function() {
        if (this.get('isAdmissionVisit')) {
            return 'Admission Date';
        } else {
            return 'Start Date';
        }
    }.property('isAdmissionVisit'),
    
    cancelAction: 'returnToPatient',
    chargePricingCategory: 'Ward',
    chargeRoute: 'visits.charge',
    clincList: Ember.computed.alias('controllers.visits.clinicList'),
    diagnosisList: Ember.computed.alias('controllers.visits.diagnosisList'),
    findPatientVisits: false,
    pricingList: null, //This gets filled in by the route
    pricingTypes: Ember.computed.alias('controllers.visits.wardPricingTypes'),
    physicianList: Ember.computed.alias('controllers.visits.physicianList'),
    locationList: Ember.computed.alias('controllers.visits.locationList'),
    visitTypesList: Ember.computed.alias('controllers.visits.visitTypeList'),
    lookupListsToUpdate: [{
        name: 'clinicList',
        property: 'clinic',
        id: 'clinic_list'
    }, {
        name: 'diagnosisList',
        property: 'primaryBillingDiagnosis',
        id: 'diagnosis_list'
    }, {
        name: 'diagnosisList',
        property: 'primaryDiagnosis',
        id: 'diagnosis_list'
    }, {
        name: 'physicianList',
        property: 'examiner',
        id: 'physician_list'
    }, {
        name: 'locationList',
        property: 'location',
        id: 'visit_location_list'
    }],
    
    newVisit: false,
    visitStatuses: [
        'Admitted',
        'Discharged'
    ],

    updateCapability: 'add_visit',

    haveAdditionalDiagnoses: function() {
        return !Ember.isEmpty(this.get('additionalDiagnoses'));
    }.property('additionalDiagnoses.@each'),

    afterUpdate: function() {
        this.displayAlert('Visit Saved', 'The visit record has been saved.');
    },
    
    beforeUpdate: function() {        
        if (this.get('isNew')) {
            this.set('newVisit', true);
        }
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this.updateCharges().then(resolve, reject);
        }.bind(this));
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
        this.get(listName).then(function(list) {
            if (removeObject) {
                list.removeObject(listObject);
            } else {
                list.addObject(listObject);
            }
            this.send('update', true);
            this.send('closeModal');
        }.bind(this));
    },
    
    actions: {
        addDiagnosis: function(newDiagnosis) {
            var additionalDiagnoses = this.get('additionalDiagnoses');
            if (!Ember.isArray(additionalDiagnoses)) {
                additionalDiagnoses = [];
            }
            additionalDiagnoses.addObject(newDiagnosis);
            this.set('additionalDiagnoses', additionalDiagnoses);
            this.send('update', true);
            this.send('closeModal');
        },
        
        deleteDiagnosis: function(diagnosis) {
            var additionalDiagnoses = this.get('additionalDiagnoses');
            additionalDiagnoses.removeObject(diagnosis);
            this.set('additionalDiagnoses', additionalDiagnoses);
            this.send('update', true);
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
        
        showAddDiagnosis: function() {
            this.send('openModal', 'visits.add-diagnosis', AddDiagnosisModel.create());
        },
        
        showAddProcedure: function() {
            var newProcedure = this.get('store').createRecord('procedure', {
                dateRecorded: new Date(),
                visit: this.get('model'),
            });
            this.transitionToRoute('procedures.edit', newProcedure);
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
            if (Ember.isEmpty(procedure.get('visit'))) {
                procedure.set('visit', this.get('model'));
            }
            this.transitionToRoute('procedures.edit', procedure);
        },
        
        showEditVitals: function(vitals) {
            this.send('openModal', 'visits.vitals.edit', vitals);
        }
    }
});
