import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import Ember from 'ember';
import PatientId from 'hospitalrun/mixins/patient-id';
import { translationMacro as t } from 'ember-i18n';

const {
  isEmpty
} = Ember;

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
    createNewVisit(patient) {
      let diagnoses = patient.get('diagnoses');
      let visitDiagnoses;

      if (!isEmpty(diagnoses)) {
        visitDiagnoses = diagnoses.filterBy('active', true).map((diagnosis) => {
          return this.store.createRecord('diagnosis',
            diagnosis.getProperties('active', 'date', 'diagnosis', 'secondaryDiagnosis')
          );
        });
      }
      this.transitionTo('visits.edit', 'new').then((newRoute) =>{
        if (!isEmpty(visitDiagnoses)) {
          let newVisitDiagnosis = newRoute.currentModel.get('diagnoses');
          newVisitDiagnosis.addObjects(visitDiagnoses);
        }
        newRoute.currentModel.set('patient', patient);
      });
    }
  },
  newButtonText: t('patients.buttons.newPatient'),
  moduleName: 'patients'
});
