import { resolve } from 'rsvp';
import { alias, map } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import EmberObject, {
  get,
  computed,
  setProperties
} from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AllergyActions from 'hospitalrun/mixins/allergy-actions';
import BloodTypes from 'hospitalrun/mixins/blood-types';
import DiagnosisActions from 'hospitalrun/mixins/diagnosis-actions';
import PatientId from 'hospitalrun/mixins/patient-id';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import ReturnTo from 'hospitalrun/mixins/return-to';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitStatus from 'hospitalrun/utils/visit-statuses';
import PatientVisits from 'hospitalrun/mixins/patient-visits';

export default AbstractEditController.extend(AllergyActions, BloodTypes, DiagnosisActions, ReturnTo, UserSession, PatientId, PatientNotes, PatientVisits, {

  canAddAppointment: computed(function() {
    return this.currentUserCan('add_appointment');
  }),

  canAddContact: computed(function() {
    return this.currentUserCan('add_patient');
  }),

  canAddImaging: computed(function() {
    return this.currentUserCan('add_imaging');
  }),

  canAddLab: computed(function() {
    return this.currentUserCan('add_lab');
  }),

  canAddMedication: computed(function() {
    return this.currentUserCan('add_medication');
  }),

  canAddPhoto: computed(function() {
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    return (this.currentUserCan('add_photo') && isFileSystemEnabled);
  }),

  canAddSocialWork: computed(function() {
    return this.currentUserCan('add_socialwork');
  }),

  canAddVisit: computed(function() {
    return this.currentUserCan('add_visit');
  }),

  canDeleteAppointment: computed(function() {
    return this.currentUserCan('delete_appointment');
  }),

  canDeleteContact: computed(function() {
    return this.currentUserCan('add_patient');
  }),

  canDeleteImaging: computed(function() {
    return this.currentUserCan('delete_imaging');
  }),

  canDeleteLab: computed(function() {
    return this.currentUserCan('delete_lab');
  }),

  canDeleteMedication: computed(function() {
    return this.currentUserCan('delete_medication');
  }),

  canDeletePhoto: computed(function() {
    return this.currentUserCan('delete_photo');
  }),

  canDeleteSocialWork: computed(function() {
    return this.currentUserCan('delete_socialwork');
  }),

  canDeleteVisit: computed(function() {
    return this.currentUserCan('delete_visit');
  }),

  patientTypes: computed(function() {
    let intl = get(this, 'intl');
    let types = [
      'Charity',
      'Private'
    ];
    return types.map((type) => {
      return intl.t(`patients.labels.patientType${type}`);
    });
  }),

  config: service(),
  filesystem: service(),
  database: service(),
  patientController: controller('patients'),

  addressOptions: alias('patientController.addressOptions'),
  address1Include: alias('patientController.addressOptions.value.address1Include'),
  address1Label: alias('patientController.addressOptions.value.address1Label'),
  address2Include: alias('patientController.addressOptions.value.address2Include'),
  address2Label: alias('patientController.addressOptions.value.address2Label'),
  address3Include: alias('patientController.addressOptions.value.address3Include'),
  address3Label: alias('patientController.addressOptions.value.address3Label'),
  address4Include: alias('patientController.addressOptions.value.address4Include'),
  address4Label: alias('patientController.addressOptions.value.address4Label'),

  clinicList: alias('patientController.clinicList'),
  countryList: alias('patientController.countryList'),
  diagnosisList: alias('patientController.diagnosisList'),
  isFileSystemEnabled: alias('filesystem.isFileSystemEnabled'),
  pricingProfiles: map('patientController.pricingProfiles', SelectValues.selectObjectMap),
  sexList: alias('patientController.sexList'),
  statusList: alias('patientController.statusList'),

  haveAdditionalContacts: computed('model.additionalContacts', function() {
    let additionalContacts = this.get('model.additionalContacts');
    return !isEmpty(additionalContacts);
  }),

  haveAddressOptions: computed('addressOptions', function() {
    let addressOptions = this.get('addressOptions');
    return !isEmpty(addressOptions);
  }),

  lookupListsToUpdate: [{
    name: 'countryList',
    property: 'model.country',
    id: 'country_list'
  }, {
    name: 'clinicList',
    property: 'model.clinic',
    id: 'clinic_list'
  }, {
    name: 'sexList',
    property: 'model.sex',
    id: 'sex'
  }, {
    name: 'statusList',
    property: 'model.status',
    id: 'patient_status_list'
  }],

  patientImaging: computed('model.visits.[].imaging', function() {
    return this.getVisitCollection('imaging');
  }),

  patientLabs: computed('model.visits.[].labs', function() {
    return this.getVisitCollection('labs');
  }),

  patientMedications: computed('model.visits.[].medication', function() {
    return this.getVisitCollection('medication');
  }),

  patientProcedures: computed('model.visits.[].procedures', 'model.operationReports.[].procedures', function() {
    let visits = this.get('model.visits');
    let operationReports = get(this, 'model.operationReports');
    return this._getPatientProcedures(operationReports, visits);
  }),

  showExpenseTotal: computed('model.expenses.[]', function() {
    let expenses = this.get('model.expenses');
    return !isEmpty(expenses);
  }),

  totalExpenses: computed('model.expenses.@each.cost', function() {
    let expenses = this.get('model.expenses');
    if (!isEmpty(expenses)) {
      let total = expenses.reduce(function(previousValue, expense) {
        if (!isEmpty(expense.cost)) {
          return previousValue + parseInt(expense.cost);
        }
      }, 0);
      return total;
    }
  }),

  updateCapability: 'add_patient',

  actions: {
    addAllergy(newAllergy) {
      let patient = get(this, 'model');
      this.savePatientAllergy(patient, newAllergy);
    },

    addContact(newContact) {
      let additionalContacts = this.getWithDefault('model.additionalContacts', []);
      let model = this.get('model');
      additionalContacts.addObject(newContact);
      model.set('additionalContacts', additionalContacts);
      this.send('update', true);
      this.send('closeModal');
    },

    addDiagnosis(newDiagnosis) {
      let diagnoses = this.get('model.diagnoses');
      diagnoses.addObject(newDiagnosis);
      this.send('update', true);
      this.send('closeModal');
    },

    returnToPatient() {
      this.transitionToRoute('patients.index');
    },
    /**
     * Add the specified photo to the patient's record.
     */
    addPhoto(savedPhotoRecord) {
      let photos = this.get('model.photos');
      photos.addObject(savedPhotoRecord);
      this.send('closeModal');
    },

    appointmentDeleted(deletedAppointment) {
      let appointments = this.get('model.appointments');
      appointments.removeObject(deletedAppointment);
      this.send('closeModal');
    },

    deleteAllergy(allergy) {
      let patient = get(this, 'model');
      this.deletePatientAllergy(patient, allergy);
    },

    deleteContact(model) {
      let contact = model.get('contactToDelete');
      let additionalContacts = this.get('model.additionalContacts');
      additionalContacts.removeObject(contact);
      this.send('update', true);
    },

    deleteExpense(model) {
      let expense = model.get('expenseToDelete');
      let expenses = this.get('model.expenses');
      expenses.removeObject(expense);
      this.send('update', true);
    },

    deleteFamily(model) {
      let family = model.get('familyToDelete');
      let familyInfo = this.get('model.familyInfo');
      familyInfo.removeObject(family);
      this.send('update', true);
    },

    deletePhoto(model) {
      let photo = model.get('photoToDelete');
      let photoId = photo.get('id');
      let photos = this.get('model.photos');
      let filePath = photo.get('fileName');
      photos.removeObject(photo);
      photo.destroyRecord().then(function() {
        let fileSystem = this.get('filesystem');
        let isFileSystemEnabled = this.get('isFileSystemEnabled');
        if (isFileSystemEnabled) {
          let pouchDbId = this.get('database').getPouchId(photoId, 'photo');
          fileSystem.deleteFile(filePath, pouchDbId);
        }
      }.bind(this));
    },

    editAppointment(appointment) {
      if (this.get('canAddAppointment')) {
        appointment.set('returnToPatient', this.get('model.id'));
        appointment.set('returnTo', null);
        this.transitionToRoute('appointments.edit', appointment);
      }
    },

    editImaging(imaging) {
      if (this.get('canAddImaging')) {
        if (imaging.get('canEdit')) {
          imaging.set('returnToPatient', this.get('model.id'));
          this.transitionToRoute('imaging.edit', imaging);
        }
      }
    },

    editLab(lab) {
      if (this.get('canAddLab')) {
        if (lab.get('canEdit')) {
          lab.setProperties('returnToPatient', this.get('model.id'));
          this.transitionToRoute('labs.edit', lab);
        }
      }
    },

    editMedication(medication) {
      if (this.get('canAddMedication')) {
        if (medication.get('canEdit')) {
          medication.set('returnToPatient', this.get('model.id'));
          this.transitionToRoute('medication.edit', medication);
        }
      }
    },

    editOperativePlan(operativePlan) {
      let model = operativePlan;
      if (isEmpty(model)) {
        this._addChildObject('patients.operative-plan', (route) =>{
          route.controller.getPatientDiagnoses(this.get('model'), route.currentModel);
        });
      } else {
        model.set('returnToVisit');
        model.set('returnToPatient', this.get('model.id'));
        this.transitionToRoute('patients.operative-plan', model);
      }
    },

    editOperationReport(operationReport) {
      operationReport.set('returnToPatient', this.get('model.id'));
      this.transitionToRoute('patients.operation-report', operationReport);
    },

    editPhoto(photo) {
      this.send('openModal', 'patients.photo', photo);
    },

    editProcedure(procedure) {
      if (this.get('canAddVisit')) {
        procedure.set('patient', this.get('model'));
        procedure.set('returnToVisit');
        procedure.set('returnToPatient', this.get('model.id'));
        this.transitionToRoute('procedures.edit', procedure);
      }
    },

    editVisit(visit) {
      if (this.get('canAddVisit')) {
        visit.set('returnToPatient', this.get('model.id'));
        this.transitionToRoute('visits.edit', visit);
      }
    },

    newAppointment() {
      this._addChildObject('appointments.edit');
    },

    newImaging() {
      this._addChildObject('imaging.edit');
    },

    newLab() {
      this._addChildObject('labs.edit');
    },

    newMedication() {
      this._addChildObject('medication.edit');
    },

    newSurgicalAppointment() {
      this.transitionToRoute('appointments.edit', 'newsurgery').then((newRoute) => {
        newRoute.currentModel.setProperties({
          patient: this.get('model'),
          returnToPatient: this.get('model.id'),
          selectPatient: false
        });
      });
    },

    newVisit() {
      let patient = this.get('model');
      this.send('createNewVisit', patient, true);
    },

    showAddContact() {
      this.send('openModal', 'patients.add-contact', {});
    },

    showAddPhoto() {
      let newPatientPhoto = this.get('store').createRecord('photo', {
        patient: this.get('model'),
        saveToDir: `${this.get('model.id')}/photos/`
      });
      newPatientPhoto.set('editController', this);
      this.send('openModal', 'patients.photo', newPatientPhoto);
    },

    showAddPatientNote(model) {
      if (this.get('canAddNote')) {
        if (isEmpty(model)) {
          model = this.get('store').createRecord('patient-note', {
            patient: this.get('model'),
            createdBy: this.getUserName()
          });
        }
        this.send('openModal', 'patients.notes', model);
      }
    },

    showDeleteAppointment(appointment) {
      appointment.set('deleteFromPatient', true);
      this.send('openModal', 'appointments.delete', appointment);
    },

    showDeleteContact(contact) {
      this.send('openModal', 'dialog', EmberObject.create({
        confirmAction: 'deleteContact',
        title: this.get('intl').t('patients.titles.deleteContact'),
        message: this.get('intl').t('patients.titles.deletePhoto', { object: 'contact' }),
        contactToDelete: contact,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('intl').t('buttons.ok')
      }));
    },

    showDeleteExpense(expense) {
      this.send('openModal', 'dialog', EmberObject.create({
        confirmAction: 'deleteExpense',
        title: this.get('intl').t('patients.titles.deleteExpense'),
        message: this.get('intl').t('patients.titles.deletePhoto', { object: 'expense' }),
        expenseToDelete: expense,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('intl').t('buttons.ok')
      }));
    },

    showDeleteFamily(familyInfo) {
      this.send('openModal', 'dialog', EmberObject.create({
        confirmAction: 'deleteFamily',
        title: this.get('intl').t('patients.titles.deleteFamilyMember'),
        message: this.get('intl').t('patients.titles.deletePhoto', { object: 'family member' }),
        familyToDelete: familyInfo,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('intl').t('buttons.ok')
      }));

    },

    showDeleteImaging(imaging) {
      this.send('openModal', 'imaging.delete', imaging);
    },

    showDeleteLab(lab) {
      this.send('openModal', 'labs.delete', lab);
    },

    showDeleteMedication(medication) {
      this.send('openModal', 'medication.delete', medication);
    },

    showDeletePhoto(photo) {
      this.send('openModal', 'dialog', EmberObject.create({
        confirmAction: 'deletePhoto',
        title: this.get('intl').t('patients.titles.deletePhoto'),
        message: this.get('intl').t('patients.titles.deletePhoto', { object: 'photo' }),
        photoToDelete: photo,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('intl').t('buttons.ok')
      }));
    },

    showDeleteVisit(visit) {
      visit.set('deleteFromPatient', true);
      this.send('openModal', 'visits.delete', visit);
    },

    showEditExpense(expenseInfo) {
      this._showEditSocial(expenseInfo, 'social-expense', 'expense');
    },

    showEditFamily(familyInfo) {
      this._showEditSocial(familyInfo, 'family-info', 'family-info');
    },

    updateExpense(model) {
      this._updateSocialRecord(model, 'expenses');
    },

    updateFamilyInfo(model) {
      this._updateSocialRecord(model, 'familyInfo');
    },

    visitDeleted(deletedVisit) {
      let visits = this.get('model.visits');
      let patient = this.get('model');
      let patientCheckedIn = patient.get('checkedIn');
      let patientAdmitted = patient.get('admitted');
      visits.removeObject(deletedVisit);
      if (patientAdmitted || patientCheckedIn) {
        let patientUpdate = false;
        if (patientAdmitted && isEmpty(visits.findBy('status', VisitStatus.ADMITTED))) {
          patient.set('admitted', false);
          patientUpdate = true;
        }
        if (patientCheckedIn && isEmpty(visits.findBy('status', VisitStatus.CHECKED_IN))) {
          patient.set('checkedIn', false);
          patientUpdate = true;
        }
        if (patientUpdate === true) {
          patient.save().then(() => this.send('closeModal'));
        } else {
          this.send('closeModal');
        }
      } else {
        this.send('closeModal');
      }
    }

  },

  _addChildObject(route, afterTransition) {
    let options = {
      queryParams: {
        forPatientId: this.get('model.id')
      }
    };
    this.transitionToRoute(route, 'new', options).then((newRoute) => {
      if (afterTransition) {
        afterTransition(newRoute);
      }
    });
  },

  _showEditSocial(editAttributes, modelName, route) {
    let model;
    if (isEmpty(editAttributes)) {
      model = this.get('store').createRecord(modelName, {
        newRecord: true
      });
    } else {
      model = this.get('store').push({
        data: {
          id: get(editAttributes, 'id'),
          type: modelName,
          attributes: editAttributes
        }
      });
    }
    this.send('openModal', `patients.socialwork.${route}`, model);
  },

  getVisitCollection(name) {
    let visits = this.get('model.visits');
    return this._getVisitCollection(visits, name);
  },

  _updateSocialRecord(recordToUpdate, name) {
    let socialRecords = this.getWithDefault(`model.${name}`, []);
    let isNew = recordToUpdate.get('isNew');
    let patient = this.get('model');
    let objectToUpdate = recordToUpdate.serialize();
    objectToUpdate.id = recordToUpdate.get('id');
    if (isNew) {
      socialRecords.addObject(EmberObject.create(objectToUpdate));
    } else {
      let updateRecord = socialRecords.findBy('id', objectToUpdate.id);
      setProperties(updateRecord, objectToUpdate);
    }
    patient.set(name, socialRecords);
    this.send('update', true);
    this.send('closeModal');
  },

  _updateSequence(record) {
    let config = this.get('config');
    let friendlyId = record.get('friendlyId');
    return config.getPatientPrefix().then((prefix) => {
      let re = new RegExp(`^${prefix}\\d{5}$`);
      if (!re.test(friendlyId)) {
        return;
      }
      return this.store.find('sequence', 'patient').then((sequence) => {
        let sequenceNumber = sequence.get('value');
        let patientNumber = parseInt(friendlyId.slice(prefix.length));
        if (patientNumber > sequenceNumber) {
          sequence.set('value', patientNumber);
          return sequence.save();
        }
      });
    });
  },

  beforeUpdate() {
    if (!this.get('model.isNew')) {
      return resolve();
    }
    return this.generateFriendlyId('patient').then((friendlyId) => {
      this.model.set('friendlyId', friendlyId);
    });
  },

  afterUpdate(record) {
    this._updateSequence(record).then(() => {
      $('.message').show();
      $('.message').text(this.get('intl').t('patients.messages.savedPatient', { displayName: record.get('shortDisplayName') }));
      $('.message').delay(3000).fadeOut(100);
    });
  }

});
