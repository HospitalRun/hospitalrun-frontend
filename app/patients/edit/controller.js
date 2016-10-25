import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import BloodTypes from 'hospitalrun/mixins/blood-types';
import Ember from 'ember';
import PatientId from 'hospitalrun/mixins/patient-id';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import ReturnTo from 'hospitalrun/mixins/return-to';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditController.extend(BloodTypes, ReturnTo, UserSession, PatientId, PatientNotes, {
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

  patientTypes: [
    'Charity',
    'Private'
  ],

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
  customSocialForm: Ember.computed.alias('patientController.customSocialForm.value'),
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
    return this._getVisitCollection('procedures');
  }.property('model.visits.[].procedures'),

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
    addContact: function(newContact) {
      let additionalContacts = this.getWithDefault('model.additionalContacts', []);
      let model = this.get('model');
      additionalContacts.addObject(newContact);
      model.set('additionalContacts', additionalContacts);
      this.send('update', true);
      this.send('closeModal');
    },
    returnToPatient: function() {
      this.transitionToRoute('patients.index');
    },
    /**
     * Add the specified photo to the patient's record.
     * @param {File} photoFile the photo file to add.
     * @param {String} caption the caption to store with the photo.
     * @param {boolean} coverImage flag indicating if image should be marked as the cover image (currently unused).
     */
    addPhoto: function(photoFile, caption, coverImage) {
      let dirToSaveTo = `${this.get('model.id')}/photos/`;
      let fileSystem = this.get('filesystem');
      let photos = this.get('model.photos');
      let newPatientPhoto = this.get('store').createRecord('photo', {
        patient: this.get('model'),
        localFile: true,
        caption: caption,
        coverImage: coverImage
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

    appointmentDeleted: function(deletedAppointment) {
      let appointments = this.get('model.appointments');
      appointments.removeObject(deletedAppointment);
      this.send('closeModal');
    },

    deleteContact: function(model) {
      let contact = model.get('contactToDelete');
      let additionalContacts = this.get('model.additionalContacts');
      additionalContacts.removeObject(contact);
      this.send('update', true);
    },

    deleteExpense: function(model) {
      let expense = model.get('expenseToDelete');
      let expenses = this.get('model.expenses');
      expenses.removeObject(expense);
      this.send('update', true);
    },

    deleteFamily: function(model) {
      let family = model.get('familyToDelete');
      let familyInfo = this.get('model.familyInfo');
      familyInfo.removeObject(family);
      this.send('update', true);
    },

    deletePhoto: function(model) {
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

    editAppointment: function(appointment) {
      if (this.get('canAddAppointment')) {
        appointment.set('returnToPatient', true);
        appointment.set('returnTo', null);
        this.transitionToRoute('appointments.edit', appointment);
      }
    },

    editImaging: function(imaging) {
      if (this.get('canAddImaging')) {
        if (imaging.get('canEdit')) {
          imaging.setProperties({
            'returnToPatient': true
          });
          this.transitionToRoute('imaging.edit', imaging);
        }
      }
    },

    editLab: function(lab) {
      if (this.get('canAddLab')) {
        if (lab.get('canEdit')) {
          lab.setProperties({
            'returnToPatient': true
          });
          this.transitionToRoute('labs.edit', lab);
        }
      }
    },

    editMedication: function(medication) {
      if (this.get('canAddMedication')) {
        if (medication.get('canEdit')) {
          medication.set('returnToPatient', true);
          this.transitionToRoute('medication.edit', medication);
        }
      }
    },

    editPhoto: function(photo) {
      this.send('openModal', 'patients.photo', photo);
    },

    editProcedure: function(procedure) {
      if (this.get('canAddVisit')) {
        procedure.set('patient', this.get('model'));
        procedure.set('returnToVisit', false);
        procedure.set('returnToPatient', true);
        this.transitionToRoute('procedures.edit', procedure);
      }
    },

    editVisit: function(visit) {
      if (this.get('canAddVisit')) {
        this.transitionToRoute('visits.edit', visit);
      }
    },

    newAppointment: function() {
      this._addChildObject('appointments.edit');
    },

    newImaging: function() {
      this._addChildObject('imaging.edit');
    },

    newLab: function() {
      this._addChildObject('labs.edit');
    },

    newMedication: function() {
      this._addChildObject('medication.edit');
    },

    newVisit: function() {
      let patient = this.get('model');
      let visits = this.get('model.visits');
      this.send('createNewVisit', patient, visits);
    },

    showAddContact: function() {
      this.send('openModal', 'patients.add-contact', {});
    },

    showAddPhoto: function() {
      this.send('openModal', 'patients.photo', {
        isNew: true
      });
    },

    showAddPatientNote: function(model) {
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

    showDeleteAppointment: function(appointment) {
      appointment.set('deleteFromPatient', true);
      this.send('openModal', 'appointments.delete', appointment);
    },

    showDeleteContact: function(contact) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteContact',
        title: this.get('i18n').t('patients.titles.deleteContact'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'contact' }),
        contactToDelete: contact,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    showDeleteExpense: function(expense) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteExpense',
        title: this.get('i18n').t('patients.titles.deleteExpense'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'expense' }),
        expenseToDelete: expense,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    showDeleteFamily: function(familyInfo) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteFamily',
        title: this.get('i18n').t('patients.titles.deleteFamilyMember'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'family member' }),
        familyToDelete: familyInfo,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));

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

    showDeletePhoto: function(photo) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deletePhoto',
        title: this.get('i18n').t('patients.titles.deletePhoto'),
        message: this.get('i18n').t('patients.titles.deletePhoto', { object: 'photo' }),
        photoToDelete: photo,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    showDeleteVisit: function(visit) {
      visit.set('deleteFromPatient', true);
      this.send('openModal', 'visits.delete', visit);
    },

    showEditExpense: function(expenseInfo) {
      this._showEditSocial(expenseInfo, 'social-expense', 'expense');
    },

    showEditFamily: function(familyInfo) {
      this._showEditSocial(familyInfo, 'family-info', 'family-info');
    },

    updateExpense: function(model) {
      this._updateSocialRecord(model, 'expenses');
    },

    updateFamilyInfo: function(model) {
      this._updateSocialRecord(model, 'familyInfo');
    },

    updatePhoto: function(photo) {
      photo.save().then(function() {
        this.send('closeModal');
      }.bind(this));
    },

    visitDeleted: function(deletedVisit) {
      let visits = this.get('model.visits');
      let patient = this.get('model');
      let patientAdmitted = patient.get('admitted');
      visits.removeObject(deletedVisit);
      if (patientAdmitted && Ember.isEmpty(visits.findBy('status', 'Admitted'))) {
        patient.set('admitted', false);
        patient.save().then(() => this.send('closeModal'));
      } else {
        this.send('closeModal');
      }
    }

  },

  _addChildObject: function(route) {
    this.transitionToRoute(route, 'new').then(function(newRoute) {
      newRoute.currentModel.setProperties({
        patient: this.get('model'),
        returnToPatient: true,
        selectPatient: false
      });
    }.bind(this));
  },

  _showEditSocial: function(editAttributes, modelName, route) {
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

  _getVisitCollection: function(name) {
    let returnList = [];
    let visits = this.get('model.visits');
    if (!Ember.isEmpty(visits)) {
      visits.forEach(function(visit) {
        visit.get(name).then(function(items) {
          returnList.addObjects(items);
          if (returnList.length > 0) {
            returnList[0].set('first', true);
          }
        });
      });
    }
    return returnList;
  },

  _updateSocialRecord: function(recordToUpdate, name) {
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

  _updateSequence: function(record) {
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

  beforeUpdate: function() {
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

  afterUpdate: function(record) {
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
