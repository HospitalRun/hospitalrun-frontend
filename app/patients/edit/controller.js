import BloodTypes from 'hospitalrun/mixins/blood-types';
import DOBDays from 'hospitalrun/mixins/dob-days';    
import GenderList from 'hospitalrun/mixins/gender-list';    
import ICD10 from 'hospitalrun/mixins/icd10';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(BloodTypes, DOBDays, GenderList, ICD10, {
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
    
    afterUpdate: function(record) {
        this.transitionToRoute('/patients/search/'+record.get('id'));
    }
    
});
