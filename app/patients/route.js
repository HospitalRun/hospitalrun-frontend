import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import PatientId from 'hospitalrun/mixins/patient-id';
import { translationMacro as t } from 'ember-i18n';

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
    name: 'customSocialForm',
    findArgs: ['option', 'custom_form_social']
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
    name: 'sexList',
    findArgs: ['lookup', 'sex']
  }, {
    name: 'statusList',
    findArgs: ['lookup', 'patient_status_list']
  }, {
    name: 'visitTypesList',
    findArgs: ['lookup', 'visit_types']
  }],

  actions: {
    createNewVisit(patient, requestedFromPatient) {
      let typeOfNewVisit = 'checkin';
      if (requestedFromPatient) {
        typeOfNewVisit = 'new';
      }
      this.transitionTo('visits.edit', typeOfNewVisit).then((newRoute) =>{
        if (requestedFromPatient) {
          newRoute.currentModel.set('returnToPatient', patient.get('id'));
        } else {
          newRoute.currentModel.set('returnTo', 'patients');
        }
        newRoute.currentModel.set('patient', patient);
        newRoute.currentModel.set('hidePatientSelection', true);
        newRoute.controller.getPatientDiagnoses(patient);
      });
    }
  },
  newButtonText: t('patients.buttons.newPatient'),
  moduleName: 'patients'
});
