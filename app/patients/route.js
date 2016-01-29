import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import Ember from 'ember';
import PatientId from 'hospitalrun/mixins/patient-id';
export default AbstractModuleRoute.extend(PatientId, {
  addCapability: 'add_patient',
  additionalModels: [{
    name: 'addressOptions',
    findArgs: ['option', 'address_options']
  }, {
    name: 'clinicList',
    findArgs: ['lookup', 'clinic_list']
  }, {
    name: 'countryList',
    findArgs: ['lookup', 'country_list']
  }, {
    name: 'diagnosisList',
    findArgs: ['lookup', 'diagnosis_list']
  }, {
    name: 'locationList',
    findArgs: ['lookup', 'visit_location_list']
  }, {
    name: 'physicianList',
    findArgs: ['lookup', 'physician_list']
  }, {
    name: 'pricingProfiles',
    findArgs: ['price-profile']
  }, {
    name: 'statusList',
    findArgs: ['lookup', 'patient_status_list']
  }, {
    name: 'visitTypesList',
    findArgs: ['lookup', 'visit_types']
  }],

  actions: {
    createNewVisit: function(patient, visits) {
      var lastVisit = visits.get('lastObject'),
        propertiesToSet = {};

      if (!Ember.isEmpty(lastVisit)) {
        propertiesToSet = lastVisit.getProperties('primaryDiagnosis', 'primaryBillingDiagnosis');
      }
      propertiesToSet.patient = patient;

      this.transitionTo('visits.edit', 'new').then(function(newRoute) {
        newRoute.currentModel.setProperties(propertiesToSet);
      }.bind(this));
    }
  },
  moduleName: 'patients',
  newButtonText: '+ new patient',
  sectionTitle: 'Patients',
  subActions: [{
    text: 'Patient listing',
    linkTo: 'patients.index'
  }, {
    text: 'Reports',
    linkTo: 'patients.reports'
  }]
});
