import BloodTypes from 'hospitalrun/mixins/blood-types';
import DOBDays from 'hospitalrun/mixins/dob-days';    
import GenderList from 'hospitalrun/mixins/gender-list';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import AddDiagnosisModel from 'hospitalrun/models/add-diagnosis';    

export default AbstractEditController.extend(BloodTypes, DOBDays, GenderList, {
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
            this.transitionToRoute('appointments.edit', appointment);
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
            this.transitionToRoute('appointments.edit', newAppointment);
        },             
        
        newVisit: function() {
            var newVisit = this.get('store').createRecord('visit', {
                startDate: new Date(),
                patient: this.get('model')
            });            
            this.transitionToRoute('visits.edit', newVisit);
        },     
        
        showAddDiagnosis: function() {
            this.send('openModal', 'patients.add-diagnosis', AddDiagnosisModel.create());
        },
        
        showDeleteAppointment: function(appointment) {
            this.send('openModal', 'appointments.delete', appointment);
        },

        showDeleteVisit: function(visit) {
            this.send('openModal', 'visits.delete', visit);
        }
        
    },
    
    afterUpdate: function(record) {
        this.transitionToRoute('/patients/search/'+record.get('id'));
    }
    
});
