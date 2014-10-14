import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import BloodTypes from 'hospitalrun/mixins/blood-types';
import DOBDays from 'hospitalrun/mixins/dob-days';
import GenderList from 'hospitalrun/mixins/gender-list';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractEditController.extend(BloodTypes, DOBDays, GenderList, UserSession, {
    canAddAppointment: function() {        
        return this.currentUserCan('add_appointment');
    }.property(),    

    canAddDiagnosis: function() {        
        return this.currentUserCan('add_diagnosis');
    }.property(),    

    canAddImaging: function() {
        return this.currentUserCan('add_imaging');
    }.property(),    

    canAddLab: function() {        
        return this.currentUserCan('add_lab');
    }.property(),    
    
    canAddMedication: function() {        
        return this.currentUserCan('add_medication');
    }.property(),    
    
    canAddVisit: function() {        
        return this.currentUserCan('add_visit');
    }.property(),

    canDeleteAppointment: function() {        
        return this.currentUserCan('delete_appointment');
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
    
    canDeleteVisit: function() {        
        return this.currentUserCan('delete_visit');
    }.property(),
    
    primaryDiagnosisIdChanged: function() {
        this.get('model').validate();
    }.observes('primaryDiagnosisId'),
    
    needs: 'patients',

    clinicList: Ember.computed.alias('controllers.patients.clinicList'),
    countryList: Ember.computed.alias('controllers.patients.countryList'),    

    lookupListsToUpdate: [{
        name: 'countryList',
        property: 'country',
        id: 'country_list'
    }, {
        name: 'clinicList',
        property: 'clinic',
        id: 'clinic_list'
    }],
    
    dobInDays: function() {
        var dob = this.get('dateOfBirth');
        return this.convertDOBToText(dob);
    }.property('dateOfBirth'),
    
    patientImaging: function() {
        return this._getVisitCollection('imaging');
    }.property('visits.@each.imaging'),    
    
    patientLabs: function() {
        return this._getVisitCollection('labs');
    }.property('visits.@each.labs'),
    
    patientMedications: function() {
        return this._getVisitCollection('medication');
    }.property('visits.@each.medication'),
    
    updateCapability: 'add_patient',

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
        
        editAppointment: function(appointment) {
            appointment.set('returnToPatient', true);
            this.transitionToRoute('appointments.edit', appointment);
        },

        editImaging: function(imaging) {
            imaging.setProperties({
                'isCompleting': false,
                'returnToPatient': true
            });
            this.transitionToRoute('imaging.edit', imaging);
        },        
        
        editLab: function(lab) {
            lab.setProperties({
                'isCompleting': false,
                'returnToPatient': true
            });
            this.transitionToRoute('labs.edit', lab);
        },        
        
        editMedication: function(medication) {
            medication.set('returnToPatient', true);
            this.transitionToRoute('medication.edit', medication);
        },    
        
        editVisit: function(visit) {
            this.transitionToRoute('visits.edit', visit);
        },
        
        newAppointment: function() {
            var now = moment().hours(8).minutes(0).seconds(0).toDate();
            var newAppointment = this.get('store').createRecord('appointment', {
                patient: this.get('model'),
                startDate: now,
                endDate: now
            });
            newAppointment.set('returnToPatient', true);
            this.transitionToRoute('appointments.edit', newAppointment);
        },

        newImaging: function() {
            var newImaging = this.get('store').createRecord('imaging', {
                isCompleting: false,
                patient: this.get('model'),
                returnToPatient: true
            });            
            this.transitionToRoute('imaging.edit', newImaging);
        },
        
        newLab: function() {
            var newLab = this.get('store').createRecord('lab', {
                isCompleting: false,
                patient: this.get('model'),
                returnToPatient: true
            });            
            this.transitionToRoute('labs.edit', newLab);
        },
        
        newMedication: function() {
            var newMedication = this.get('store').createRecord('medication', {
                prescriptionDate: moment().startOf('day').toDate(),
                patient: this.get('model'),
                returnToPatient: true
            });
            this.transitionToRoute('medication.edit', newMedication);
        },
        
        newVisit: function() {
            var newVisit = this.get('store').createRecord('visit', {
                startDate: new Date(),
                patient: this.get('model')
            });            
            this.transitionToRoute('visits.edit', newVisit);
        },     
                
        showAddPhoto: function() {
            this.send('openModal', 'patients.add-photo', {});
        },        
        
        showDeleteAppointment: function(appointment) {
            this.send('openModal', 'appointments.delete', appointment);
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

        showDeleteVisit: function(visit) {
            this.send('openModal', 'visits.delete', visit);
        }
        
    },
    
    _getVisitCollection: function(name) {
        var returnList = [],
            visits = this.get('visits');
        visits.forEach(function(visit) {
            visit.get(name).then(function(items) {
                returnList.addObjects(items);
            });
        });
        return returnList;        
    },
    
    afterUpdate: function(record) {
        this.transitionToRoute('/patients/search/'+record.get('id'));
    }
    
});
