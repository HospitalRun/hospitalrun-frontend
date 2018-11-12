import { resolve, Promise as EmberPromise } from 'rsvp';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { isEmpty } from '@ember/utils';
import EmberObject, { set, get, computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AddNewPatient from 'hospitalrun/mixins/add-new-patient';
import AllergyActions from 'hospitalrun/mixins/allergy-actions';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import DiagnosisActions from 'hospitalrun/mixins/diagnosis-actions';
import moment from 'moment';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitStatus from 'hospitalrun/utils/visit-statuses';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(AddNewPatient, AllergyActions, ChargeActions, DiagnosisActions, PatientSubmodule, PatientNotes, UserSession, VisitTypes, {
  visitsController: controller('visits'),
  filesystem: service(),
  additionalButtons: computed('model.status', function() {
    let buttonProps = {
      buttonIcon: 'glyphicon glyphicon-log-out',
      class: 'btn btn-primary on-white'
    };
    let intl = this.get('intl');
    let status = this.get('model.status');
    if (status === VisitStatus.ADMITTED) {
      buttonProps.buttonAction = 'discharge';
      buttonProps.buttonText = intl.t('visits.buttons.discharge');
      return [buttonProps];
    } else if (status === VisitStatus.CHECKED_IN) {
      buttonProps.buttonAction = 'checkout';
      buttonProps.buttonText = intl.t('visits.buttons.checkOut');
      return [buttonProps];
    }
  }),

  noReport: false,

  canAddAppointment: computed('model.isNew', function() {
    return (!this.get('model.isNew') && this.currentUserCan('add_appointment'));
  }),

  canAddBillingDiagnosis: computed('model.isNew', function() {
    return (!this.get('model.isNew') && this.currentUserCan('add_billing_diagnosis'));
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

  canAddProcedure: computed(function() {
    return this.currentUserCan('add_procedure');
  }),

  canAddVitals: computed(function() {
    return this.currentUserCan('add_vitals');
  }),

  canAddReport: computed('hasReport', function() {
    return this.currentUserCan('add_report') && !this.get('hasReport');
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

  canDeleteProcedure: computed(function() {
    return this.currentUserCan('delete_procedure');
  }),

  canDeleteVitals: computed(function() {
    return this.currentUserCan('delete_vitals');
  }),

  canDeleteReport: computed(function() {
    return this.currentUserCan('delete_report');
  }),

  isAdmissionVisit: computed('model.visitType', function() {
    let visitType = this.get('model.visitType');
    let isAdmission = (visitType === 'Admission');
    return isAdmission;
  }),

  cancelAction: computed('model.returnTo', 'model.returnToPatient', function() {
    let returnTo = this.get('model.returnTo');
    if (!isEmpty(returnTo)) {
      return 'returnTo';
    } else if (!isEmpty(this.get('model.returnToPatient'))) {
      return 'returnToPatient';
    } else {
      return this._super();
    }
  }),

  allowAddAllergy: not('model.isNew'),
  allowAddDiagnosis: not('model.isNew'),
  allowAddOperativePlan: not('model.isNew'),
  chargePricingCategory: 'Ward',
  chargeRoute: 'visits.charge',
  diagnosisList: alias('visitsController.diagnosisList'),
  findPatientVisits: false,
  hideChargeHeader: true,
  isFileSystemEnabled: alias('filesystem.isFileSystemEnabled'),
  patientImaging: alias('model.imaging'),
  patientLabs: alias('model.labs'),
  patientMedications: alias('model.medication'),
  pricingList: null, // This gets filled in by the route
  pricingTypes: alias('visitsController.wardPricingTypes'),
  physicianList: alias('visitsController.physicianList'),
  locationList: alias('visitsController.locationList'),
  sexList: alias('visitsController.sexList'),
  visitTypesList: alias('visitsController.visitTypesList'),
  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.examiner',
    id: 'physician_list'
  }, {
    name: 'locationList',
    property: 'model.location',
    id: 'visit_location_list'
  }],

  updateCapability: 'add_visit',

  showPatientSelection: computed('model.checkIn', 'model.hidePatientSelection', function() {
    return this.get('model.checkIn') && !this.get('model.hidePatientSelection');
  }),

  updateButtonIcon: computed('model.checkIn', function() {
    if (this.get('model.checkIn')) {
      return 'glyphicon glyphicon-log-in';
    }
  }),

  updateButtonText: computed('model.{checkIn,isNew}', function() {
    let intl = this.get('intl');
    if (this.get('model.checkIn')) {
      return intl.t('visits.buttons.checkIn');
    } else {
      return this._super();
    }
  }),

  validVisitTypes: computed('visitTypes', 'model.outPatient', function() {
    let outPatient = this.get('model.outPatient');
    let visitTypes = this.get('visitTypes');
    if (outPatient === true) {
      visitTypes = visitTypes.filter(function(visitType) {
        return (visitType.id !== 'Admission');
      });
    }
    return visitTypes;
  }),

  _addChildObject(route, afterTransition) {
    let options = {
      queryParams: {
        forVisitId: this.get('model.id')
      }
    };
    this.transitionToRoute(route, 'new', options).then((newRoute) => {
      if (afterTransition) {
        afterTransition(newRoute);
      }
    });
  },

  _finishAfterUpdate() {
    let addedNewPatient = this.get('addedNewPatient');
    let checkIn = this.get('model.checkIn');
    let intl = this.get('intl');
    let updateMesage = intl.t('visits.messages.visitSaved');
    let updateTitle = intl.t('visits.titles.visitSaved');
    if (checkIn === true) {
      let model = this.get('model');
      model.set('checkIn');
      this.send('setSectionHeader', {
        currentScreenTitle: intl.t('visits.titles.editVisit')
      });
    }

    if (checkIn) {
      updateTitle = intl.t('visits.titles.checkedIn');
      let patientDetails = {
        patientName: this.get('model.patient.displayName')
      };
      if (addedNewPatient === true) {
        this.set('addedNewPatient');
        updateMesage = intl.t('visits.messages.patientCreatedAndCheckedIn', patientDetails);
      } else {
        updateMesage = intl.t('visits.messages.patientCheckedIn', patientDetails);
      }
    }
    this.displayAlert(updateTitle, updateMesage);
  },

  _findAssociatedAppointment(newVisit) {
    let appointment = newVisit.get('appointment');
    let beginningOfToday = moment().startOf('day').valueOf();
    let database = this.get('database');
    let endOfToday = moment().endOf('day').valueOf();
    let maxId = database.getMaxPouchId('appointment');
    let minId = database.getMinPouchId('appointment');
    let patientId = newVisit.get('patient.id');
    if (!isEmpty(appointment)) {
      return resolve(appointment);
    } else {
      return this.store.query('appointment', {
        options: {
          startkey: [patientId, beginningOfToday, beginningOfToday, minId],
          endkey: [patientId, endOfToday, endOfToday, maxId]
        },
        mapReduce: 'appointments_by_patient'
      }).then((appointments) => {
        if (isEmpty(appointments)) {
          return;
        } else {
          return appointments.get('firstObject');
        }
      });
    }
  },

  _saveAssociatedAppointment(newVisit) {
    return this._findAssociatedAppointment(newVisit).then((appointment) => {
      if (isEmpty(appointment)) {
        newVisit.set('hasAppointment', false);
        return resolve();
      } else {
        newVisit.set('hasAppointment', true);
        appointment.set('status', 'Attended');
        return appointment.save();
      }
    });
  },

  haveAdditionalDiagnoses: computed('model.additionalDiagnoses.[]', function() {
    return !isEmpty(this.get('model.additionalDiagnoses'));
  }),

  afterUpdate(visit) {
    this.updatePatientVisitFlags(visit).then(this._finishAfterUpdate.bind(this));
  },

  beforeUpdate() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return new EmberPromise((resolve, reject) => {
        let newVisit = this.get('model');
        return newVisit.validate().then(() => {
          if (newVisit.get('isValid')) {
            let patient = newVisit.get('patient');
            if (isEmpty(patient)) {
              this.addNewPatient();
              return reject({
                ignore: true,
                message: 'creating new patient first'
              });
            }
            let outPatient = false;
            let visitType = newVisit.get('visitType');
            let visitStatus;
            if (visitType === 'Admission') {
              visitStatus = VisitStatus.ADMITTED;
            } else {
              outPatient = true;
              visitStatus = VisitStatus.CHECKED_IN;
            }
            newVisit.setProperties({
              outPatient,
              status: visitStatus
            });
            if (this.get('model.checkIn')) {
              this._saveAssociatedAppointment(newVisit).then(() => {
                this.saveNewDiagnoses().then(resolve, reject);
              });
            } else {
              this.saveNewDiagnoses().then(resolve, reject);
            }
          }
        });
      });
    } else {
      return this.updateCharges();
    }
  },

  checkoutPatient(status) {
    let visit = this.get('model');
    this.checkoutVisit(visit, status);
  },

  patientSelected(patient) {
    if (isEmpty(patient)) {
      set(this, 'model.createNewPatient', true);
    } else {
      set(this, 'model.createNewPatient', false);
      this.getPatientDiagnoses(patient, get(this, 'model'));
    }
  },

  /**
   * Adds or removes the specified object from the specified list.
   * @param {String} listName The name of the list to operate on.
   * @param {Object} listObject The object to add or removed from the
   * specified list.
   * @param {boolean} removeObject If true remove the object from the list;
   * otherwise add the specified object to the list.
   */
  updateList(listName, listObject, removeObject) {
    let model = this.get('model');
    model.get(listName).then(function(list) {
      if (removeObject) {
        list.removeObject(listObject);
      } else {
        list.addObject(listObject);
      }
      this.send('update', true);
      this.send('closeModal');
    }.bind(this));
  },

  actions: {
    addAllergy(newAllergy) {
      let patient = get(this, 'model.patient');
      this.savePatientAllergy(patient, newAllergy);
    },

    addDiagnosis(newDiagnosis) {
      this.addDiagnosisToModelAndPatient(newDiagnosis);
    },

    addPhoto(savedPhotoRecord) {
      let photos = this.get('model.photos');
      photos.addObject(savedPhotoRecord);
      this.send('closeModal');
    },

    addVitals(newVitals) {
      this.updateList('vitals', newVitals);
    },

    cancel() {
      let cancelledItem = this.get('model');
      if (this.get('model.isNew')) {
        cancelledItem.deleteRecord();
      } else {
        cancelledItem.rollbackAttributes();
      }
      this.send(this.get('cancelAction'));
    },

    checkout() {
      this.checkoutPatient(VisitStatus.CHECKED_OUT);
    },

    deleteAllergy(allergy) {
      let patient = get(this, 'model.patient');
      this.deletePatientAllergy(patient, allergy);
    },

    deleteProcedure(procedure) {
      this.updateList('procedures', procedure, true);
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

    deleteVitals(vitals) {
      this.updateList('vitals', vitals, true);
    },

    discharge() {
      this.checkoutPatient(VisitStatus.DISCHARGED);
    },

    editImaging(imaging) {
      if (imaging.get('canEdit')) {
        imaging.setProperties('returnToVisit', this.get('model.id'));
      }
      this.transitionToRoute('imaging.edit', imaging);
    },

    editLab(lab) {
      if (lab.get('canEdit')) {
        lab.setProperties('returnToVisit', this.get('model.id'));
        this.transitionToRoute('labs.edit', lab);
      }
    },

    editMedication(medication) {
      if (medication.get('canEdit')) {
        medication.set('returnToVisit', this.get('model.id'));
        this.transitionToRoute('medication.edit', medication);
      }
    },

    editOperativePlan(operativePlan) {
      let model = operativePlan;
      if (isEmpty(model)) {
        this._addChildObject('patients.operative-plan', (route) =>{
          route.controller.getPatientDiagnoses(this.get('model.patient'), route.currentModel);
        });
      } else {
        model.set('returnToVisit', this.get('model.id'));
        this.transitionToRoute('patients.operative-plan', model);
      }
    },

    editPhoto(photo) {
      this.send('openModal', 'patients.photo', photo);
    },

    newPatientChanged(createNewPatient) {
      set(this, 'model.createNewPatient', createNewPatient);
      let model = this.get('model');
      let patient = model.get('patient');
      if (createNewPatient && !isEmpty(patient)) {
        model.set('patientTypeAhead', patient.get('displayName'));
        model.set('patient');
      }
    },

    showAddVitals() {
      let newVitals = this.get('store').createRecord('vital', {
        dateRecorded: new Date()
      });
      this.send('openModal', 'visits.vitals.edit', newVitals);
    },

    showAddPatientNote(model) {
      if (isEmpty(model)) {
        model = this.get('store').createRecord('patient-note', {
          visit: this.get('model'),
          createdBy: this.getUserName(),
          patient: this.get('model').get('patient'),
          noteType: this._computeNoteType(this.get('model'))
        });
      }
      this.send('openModal', 'patients.notes', model);
    },

    showAddPhoto() {
      let newPatientPhoto = this.get('store').createRecord('photo', {
        patient: this.get('model.patient'),
        visit: this.get('model'),
        saveToDir: `${this.get('model.patient.id')}/photos/`
      });
      newPatientPhoto.set('editController', this);
      this.send('openModal', 'patients.photo', newPatientPhoto);
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

    newReport() {
      this._addChildObject('visits.reports.edit');
    },

    showAddProcedure() {
      this._addChildObject('procedures.edit');
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

    showDeleteProcedure(procedure) {
      this.send('openModal', 'visits.procedures.delete', procedure);
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

    showDeleteVitals(vitals) {
      this.send('openModal', 'visits.vitals.delete', vitals);
    },

    showEditProcedure(procedure) {
      if (isEmpty(procedure.get('visit'))) {
        procedure.set('visit', this.get('model'));
      }
      procedure.set('returnToVisit', this.get('model.id'));
      procedure.set('returnToPatient');
      this.transitionToRoute('procedures.edit', procedure);
    },

    showEditVitals(vitals) {
      this.send('openModal', 'visits.vitals.edit', vitals);
    },

    showDeletePatientNote(note) {
      this.send('openModal', 'dialog', EmberObject.create({
        confirmAction: 'deletePatientNote',
        title: 'Delete Note',
        message: 'Are you sure you want to delete this note?',
        noteToDelete: note,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('intl').t('buttons.ok')
      }));
    },

    deletePatientNote(model) {
      let note = model.get('noteToDelete');
      let patientNotes = this.get('model.patientNotes');
      patientNotes.removeObject(note);
      this.send('update', true);
    },

    startDateChanged(startDate) {
      let isAdmissionVisit = this.get('isAdmissionVisit');
      let visit = this.get('model');
      if (!isAdmissionVisit) {
        visit.set('endDate', startDate);
      }
    },

    printReport(report) {
      set(report, 'returnToVisit', get(this, 'model.id'));
      this.transitionToRoute('visits.reports.edit', report, { queryParams: { print: true } });
    },

    viewReport(report) {
      set(report, 'returnToVisit', get(this, 'model.id'));
      this.transitionToRoute('visits.reports.edit', report, { queryParams: { print: null } });
    }

  }
});
