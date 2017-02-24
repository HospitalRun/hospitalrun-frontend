import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import BloodTypes from 'hospitalrun/mixins/blood-types';
import DiagnosisActions from 'hospitalrun/mixins/diagnosis-actions';
import Ember from 'ember';
import PatientId from 'hospitalrun/mixins/patient-id';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import ReturnTo from 'hospitalrun/mixins/return-to';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitStatus from 'hospitalrun/utils/visit-statuses';

const {
  get,
  isEmpty
} = Ember;

export default AbstractEditController.extend(BloodTypes, DiagnosisActions, ReturnTo, UserSession, PatientId, PatientNotes, {

  canAddAppointment: function() {
    return this.currentUserCan('add_appointment');
  }.property(),

  canAddContact: function() {
    return this.currentUserCan('add_patient');
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

  canAddPhoto: function() {
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    return (this.currentUserCan('add_photo') && isFileSystemEnabled);
  }.property(),

  canAddSocialWork: function() {
    return this.currentUserCan('add_socialwork');
  }.property(),

  canAddVisit: function() {
    return this.currentUserCan('add_visit');
  }.property(),

  canDeleteAppointment: function() {
    return this.currentUserCan('delete_appointment');
  }.property(),

  canDeleteContact: function() {
    return this.currentUserCan('add_patient');
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

  canDeletePhoto: function() {
    return this.currentUserCan('delete_photo');
  }.property(),

  canDeleteSocialWork: function() {
    return this.currentUserCan('delete_socialwork');
  }.property(),

  canDeleteVisit: function() {
    return this.currentUserCan('delete_visit');
  }.property(),

  patientTypes: Ember.computed(function() {
    let i18n = get(this, 'i18n');
    let types = [
      'Charity',
      'Private'
    ];
    return types.map((type) => {
      return i18n.t(`patients.labels.patientType${type}`);
    });
  }),

  config: Ember.inject.service(),
  filesystem: Ember.inject.service(),
  database: Ember.inject.service(),
  patientController: Ember.inject.controller('patients'),

  addressOptions: Ember.computed.alias('patientController.addressOptions'),
  address1Include: Ember.computed.alias('patientController.addressOptions.value.address1Include'),
  address1Label: Ember.computed.alias('patientController.addressOptions.value.address1Label'),
  address2Include: Ember.computed.alias('patientController.addressOptions.value.address2Include'),
  address2Label: Ember.computed.alias('patientController.addressOptions.value.address2Label'),
  address3Include: Ember.computed.alias('patientController.addressOptions.value.address3Include'),
  address3Label: Ember.computed.alias('patientController.addressOptions.value.address3Label'),
  address4Include: Ember.computed.alias('patientController.addressOptions.value.address4Include'),
  address4Label: Ember.computed.alias('patientController.addressOptions.value.address4Label'),

  clinicList: Ember.computed.alias('patientController.clinicList'),
  countryList: Ember.computed.alias('patientController.countryList'),
  diagnosisList: Ember.computed.alias('patientController.diagnosisList'),
  isFileSystemEnabled: Ember.computed.alias('filesystem.isFileSystemEnabled'),
  pricingProfiles: Ember.computed.map('patientController.pricingProfiles', SelectValues.selectObjectMap),
  sexList: Ember.computed.alias('patientController.sexList'),
  statusList: Ember.computed.alias('patientController.statusList'),

  haveAdditionalContacts: function() {
    let additionalContacts = this.get('model.additionalContacts');
    return (!Ember.isEmpty(additionalContacts));
  }.property('model.additionalContacts'),

  haveAddressOptions: function() {
    let addressOptions = this.get('addressOptions');
    return (!Ember.isEmpty(addressOptions));
  }.property('addressOptions'),

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

  patientImaging: function() {
    return this._getVisitCollection('imaging');
  }.property('model.visits.[].imaging'),

  patientLabs: function() {
    return this._getVisitCollection('labs');
  }.property('model.visits.[].labs'),

  patientMedications: function() {
    return this._getVisitCollection('medication');
  }.property('model.visits.[].medication'),

  patientProcedures: function() {
    let patientProcedures = this._getVisitCollection('procedures');
    let operationReports = get(this, 'model.operationReports');
    operationReports.forEach((report) => {
      let reportedProcedures = get(report, 'procedures');
      let surgeryDate = get(report, 'surgeryDate');
      reportedProcedures.forEach((procedure) => {
        patientProcedures.addObject({
          description: get(procedure, 'description'),
          procedureDate: surgeryDate,
          report
        });
      });
    });
    return patientProcedures;
  }.property('model.visits.[].procedures', 'model.operationReports.[].procedures'),

  showExpenseTotal: function() {
    let expenses = this.get('model.expenses');
    return (!Ember.isEmpty(expenses));
  }.property('model.expenses.[]'),

  totalExpenses: function() {
    let expenses = this.get('model.expenses');
    if (!Ember.isEmpty(expenses)) {
      let total = expenses.reduce(function(previousValue, expense) {
        if (!Ember.isEmpty(expense.cost)) {
          return previousValue + parseInt(expense.cost);
        }
      }, 0);
      return total;
    }
  }.property('model.expenses.@each.cost'),

  updateCapability: 'add_patient',

  actions: {
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
     * @param {File} photoFile the photo file to add.
     * @param {String} caption the caption to store with the photo.
     * @param {boolean} coverImage flag indicating if image should be marked as the cover image (currently unused).
     */
    addPhoto(photoFile, caption, coverImage) {
      let dirToSaveTo = `${this.get('model.id')}/photos/`;
      let fileSystem = this.get('filesystem');
      let photos = this.get('model.photos');
      let newPatientPhoto = this.get('store').createRecord('photo', {
        patient: this.get('model'),
        localFile: true,
        caption,
        coverImage
      });
      newPatientPhoto.save().then(function(savedPhotoRecord) {
        let pouchDbId = this.get('database').getPouchId(savedPhotoRecord.get('id'), 'photo');
        fileSystem.addFile(photoFile, dirToSaveTo, pouchDbId).then(function(fileEntry) {
          fileSystem.fileToDataURL(photoFile).then(function(photoDataUrl) {
            savedPhotoRecord = this.get('store').find('photo', savedPhotoRecord.get('id')).then(function(savedPhotoRecord) {
              let dataUrlParts = photoDataUrl.split(',');
              savedPhotoRecord.setProperties({
                fileName: fileEntry.fullPath,
                url: fileEntry.toURL(),
                _attachments: {
                  file: {
                    content_type: photoFile.type,
                    data: dataUrlParts[1]
                  }
                }
              });
              savedPhotoRecord.save().then(function(savedPhotoRecord) {
                photos.addObject(savedPhotoRecord);
                this.send('closeModal');
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this));
    },

    appointmentDeleted(deletedAppointment) {
      let appointments = this.get('model.appointments');
      appointments.removeObject(deletedAppointment);
      this.send('closeModal');
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
      this.send('openModal', 'patients.photo', {
        isNew: true
      });
    },

    showAddPatientNote(model) {
      if (this.get('canAddNote')) {
        if (Ember.isEmpty(model)) {
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
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteContact',
        title: this.get('i18n').t('patients.titles.deleteContact'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'contact' }),
        contactToDelete: contact,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    showDeleteExpense(expense) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteExpense',
        title: this.get('i18n').t('patients.titles.deleteExpense'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'expense' }),
        expenseToDelete: expense,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    showDeleteFamily(familyInfo) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteFamily',
        title: this.get('i18n').t('patients.titles.deleteFamilyMember'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'family member' }),
        familyToDelete: familyInfo,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
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
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deletePhoto',
        title: this.get('i18n').t('patients.titles.deletePhoto'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'photo' }),
        photoToDelete: photo,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
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

    updatePhoto(photo) {
      photo.save().then(function() {
        this.send('closeModal');
      }.bind(this));
    },

    visitDeleted(deletedVisit) {
      let visits = this.get('model.visits');
      let patient = this.get('model');
      let patientCheckedIn = patient.get('checkedIn');
      let patientAdmitted = patient.get('admitted');
      visits.removeObject(deletedVisit);
      if (patientAdmitted || patientCheckedIn) {
        let patientUpdate = false;
        if (patientAdmitted && Ember.isEmpty(visits.findBy('status', VisitStatus.ADMITTED))) {
          patient.set('admitted', false);
          patientUpdate = true;
        }
        if (patientCheckedIn && Ember.isEmpty(visits.findBy('status', VisitStatus.CHECKED_IN))) {
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
    if (Ember.isEmpty(editAttributes)) {
      model = this.get('store').createRecord(modelName, {
        newRecord: true
      });
    } else {
      model = this.get('store').push({
        data: {
          id: Ember.get(editAttributes, 'id'),
          type: modelName,
          attributes: editAttributes
        }
      });
    }
    this.send('openModal', `patients.socialwork.${route}`, model);
  },

  _getVisitCollection(name) {
    let returnList = [];
    let visits = this.get('model.visits');
    if (!Ember.isEmpty(visits)) {
      visits.forEach(function(visit) {
        visit.get(name).then(function(items) {
          returnList.addObjects(items);
        });
      });
    }
    return returnList;
  },

  _updateSocialRecord(recordToUpdate, name) {
    let socialRecords = this.getWithDefault(`model.${name}`, []);
    let isNew = recordToUpdate.get('isNew');
    let patient = this.get('model');
    let objectToUpdate = recordToUpdate.serialize();
    objectToUpdate.id = recordToUpdate.get('id');
    if (isNew) {
      socialRecords.addObject(Ember.Object.create(objectToUpdate));
    } else {
      let updateRecord = socialRecords.findBy('id', objectToUpdate.id);
      Ember.setProperties(updateRecord, objectToUpdate);
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
      return Ember.RSVP.resolve();
    }
    let database = this.get('database');
    let id = this.get('model.friendlyId');
    let maxValue = this.get('maxValue');
    let query = {
      startkey: [id, null],
      endkey: [id, maxValue]
    };
    return database.queryMainDB(query, 'patient_by_display_id')
      .then((found) => {
        if (Ember.isEmpty(found.rows)) {
          return Ember.RSVP.resolve();
        }
        return this.generateFriendlyId()
          .then((friendlyId) => {
            this.model.set('friendlyId', friendlyId);
            return Ember.RSVP.resolve();
          });
      });
  },

  afterUpdate(record) {
    this._updateSequence(record).then(() => {
      this.send('openModal', 'dialog', Ember.Object.create({
        title: this.get('i18n').t('patients.titles.savedPatient'),
        message: this.get('i18n').t('patients.messages.savedPatient', record),
        updateButtonAction: 'returnToPatient',
        updateButtonText: this.get('i18n').t('patients.buttons.backToPatients'),
        cancelButtonText: this.get('i18n').t('buttons.close')
      }));
    });
  }

});
