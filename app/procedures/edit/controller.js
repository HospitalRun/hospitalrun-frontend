import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  visitsController: Ember.inject.controller('visits'),
  filesystem: Ember.inject.service(),

  chargePricingCategory: 'Procedure',
  chargeRoute: 'procedures.charge',

  canAddPhoto: function() {
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    return (this.currentUserCan('add_photo') && isFileSystemEnabled);
  }.property(),

  canDeletePhoto: function() {
    return this.currentUserCan('delete_photo');
  }.property(),

  anesthesiaTypes: Ember.computed.alias('visitsController.anesthesiaTypes'),
  anesthesiologistList: Ember.computed.alias('visitsController.anesthesiologistList'),
  cptCodeList: Ember.computed.alias('visitsController.cptCodeList'),
  medicationList: null,
  physicianList: Ember.computed.alias('visitsController.physicianList'),
  procedureList: Ember.computed.alias('visitsController.procedureList'),
  procedureLocations: Ember.computed.alias('visitsController.procedureLocations'),
  lookupListsToUpdate: [{
    name: 'anesthesiaTypes',
    property: 'model.anesthesiaType',
    id: 'anesthesia_types'
  }, {
    name: 'anesthesiologistList',
    property: 'model.anesthesiologist',
    id: 'anesthesiologists'
  }, {
    name: 'cptCodeList',
    property: 'model.cptCode',
    id: 'cpt_code_list'
  }, {
    name: 'physicianList',
    property: 'model.assistant',
    id: 'physician_list'
  }, {
    name: 'physicianList',
    property: 'model.physician',
    id: 'physician_list'
  }, {
    name: 'procedureList',
    property: 'model.description',
    id: 'procedure_list'
  }, {
    name: 'procedureLocations',
    property: 'model.location',
    id: 'procedure_locations'
  }],

  editController: Ember.inject.controller('visits/edit'),
  pricingList: null, // This gets filled in by the route
  pricingTypes: Ember.computed.alias('visitsController.procedurePricingTypes'),
  newProcedure: false,
  isFileSystemEnabled: Ember.computed.alias('filesystem.isFileSystemEnabled'),

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('procedures.titles.add');
    }
    return this.get('i18n').t('procedures.titles.edit');
  }.property('model.isNew'),

  updateCapability: 'add_procedure',

  actions: {
    addPhoto(savedPhotoRecord) {
      let photos = this.get('model.photos');
      photos.addObject(savedPhotoRecord);
      this.send('closeModal');
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

    editPhoto(photo) {
      this.send('openModal', 'patients.photo', photo);
    },

    showAddPhoto() {
      let newPatientPhoto = this.get('store').createRecord('photo', {
        patient: this.get('model.visit.patient'),
        procedure: this.get('model'),
        saveToDir: `${this.get('model.visit.patient.id')}/photos/`
      });
      newPatientPhoto.set('editController', this);
      this.send('openModal', 'patients.photo', newPatientPhoto);
    },

    showAddMedication() {
      let newCharge = this.get('store').createRecord('proc-charge', {
        dateCharged: new Date(),
        newMedicationCharge: true,
        quantity: 1
      });
      this.send('openModal', 'procedures.medication', newCharge);
    },

    showEditMedication(charge) {
      let medicationList = this.get('medicationList');
      let selectedMedication = medicationList.findBy('id', charge.get('medication.id'));
      charge.set('itemName', selectedMedication.name);
      this.send('openModal', 'procedures.medication', charge);
    },

    showDeleteMedication(charge) {
      this.send('openModal', 'dialog', Ember.Object.create({
        closeModalOnConfirm: false,
        confirmAction: 'deleteCharge',
        title: this.get('i18n').t('procedures.titles.deleteMedicationUsed'),
        name: this.get('i18n').t('models.medication.names.singular'),
        message: this.get('i18n').t('messages.delete_singular', { name: this.name }),
        chargeToDelete: charge,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
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
    }
  },

  beforeUpdate() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this.updateCharges().then(function() {
        if (this.get('model.isNew')) {
          this.addChildToVisit(this.get('model'), 'procedures').then(resolve, reject);
        } else {
          resolve();
        }
      }.bind(this), reject);
    }.bind(this));
  },

  afterUpdate() {
    let alertTitle = this.get('i18n').t('procedures.titles.saved');
    let alertMessage = this.get('i18n').t('procedures.messages.saved');
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  }
});
