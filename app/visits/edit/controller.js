import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AddNewPatient from 'hospitalrun/mixins/add-new-patient';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import DiagnosisActions from 'hospitalrun/mixins/diagnosis-actions';
import Ember from 'ember';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitTypes from 'hospitalrun/mixins/visit-types';

const {
  isEmpty
} = Ember;

export default AbstractEditController.extend(AddNewPatient, ChargeActions, DiagnosisActions, PatientSubmodule, PatientNotes, UserSession, VisitTypes, {
  visitsController: Ember.inject.controller('visits'),

  canAddAppointment: function() {
    return (!this.get('model.isNew') && this.currentUserCan('add_appointment'));
  }.property(),

  canAddBillingDiagnosis: function() {
    return this.currentUserCan('add_billing_diagnosis');
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

  canAddProcedure: function() {
    return this.currentUserCan('add_procedure');
  }.property(),

  canAddVitals: function() {
    return this.currentUserCan('add_vitals');
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

  canDeleteProcedure: function() {
    return this.currentUserCan('delete_procedure');
  }.property(),

  canDeleteVitals: function() {
    return this.currentUserCan('delete_vitals');
  }.property(),

  disabledAction: function() {
    this.get('model').validate().catch(Ember.K);
    this._super();
  }.property('model.endDate', 'model.startDate', 'model.isValid'),

  isAdmissionVisit: function() {
    let visitType = this.get('model.visitType');
    let isAdmission = (visitType === 'Admission');
    let visit = this.get('model');
    if (isAdmission) {
      visit.set('outPatient', false);
    } else {
      visit.set('status');
      visit.set('outPatient', true);
    }
    return isAdmission;
  }.property('model.visitType'),

  startDateChanged: function() {
    let isAdmissionVisit = this.get('isAdmissionVisit');
    let startDate = this.get('model.startDate');
    let visit = this.get('model');
    if (!isAdmissionVisit) {
      visit.set('endDate', startDate);
    }
  }.observes('isAdmissionVisit', 'model.startDate'),

  cancelAction: function() {
    let checkIn = this.get('model.checkIn');
    if (checkIn) {
      return 'returnToOutPatient';
    } else {
      return 'returnToPatient';
    }
  }.property('model.checkIn'),

  chargePricingCategory: 'Ward',
  chargeRoute: 'visits.charge',
  customForms: Ember.computed.alias('visitsController.customForms'),
  diagnosisList: Ember.computed.alias('visitsController.diagnosisList'),
  findPatientVisits: false,
  hideChargeHeader: true,
  patientImaging: Ember.computed.alias('model.imaging'),
  patientLabs: Ember.computed.alias('model.labs'),
  patientMedications: Ember.computed.alias('model.medication'),
  pricingList: null, // This gets filled in by the route
  pricingTypes: Ember.computed.alias('visitsController.wardPricingTypes'),
  physicianList: Ember.computed.alias('visitsController.physicianList'),
  locationList: Ember.computed.alias('visitsController.locationList'),
  visitTypesList: Ember.computed.alias('visitsController.visitTypesList'),
  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.examiner',
    id: 'physician_list'
  }, {
    name: 'locationList',
    property: 'model.location',
    id: 'visit_location_list'
  }],

  visitStatuses: [
    'Admitted',
    'Discharged'
  ].map(SelectValues.selectValuesMap),

  updateCapability: 'add_visit',

  updateButtonText: function() {
    let i18n = this.get('i18n');
    if (this.get('model.checkIn')) {
      return i18n.t('visits.buttons.checkIn');
    } else {
      return this._super();
    }
  }.property('model.checkIn', 'model.isNew'),

  validVisitTypes: function() {
    let outPatient = this.get('model.outPatient');
    let visitTypes = this.get('visitTypes');
    if (outPatient) {
      visitTypes = visitTypes.filter(function(visitType) {
        return (visitType.id !== 'Admission');
      });
    }
    return visitTypes;
  }.property('visitTypes', 'model.outPatient'),

  _addChildObject(route) {
    this.transitionToRoute(route, 'new').then(function(newRoute) {
      newRoute.currentModel.setProperties({
        patient: this.get('model.patient'),
        visit: this.get('model'),
        selectPatient: false,
        returnToVisit: true
      });
    }.bind(this));
  },

  _finishAfterUpdate() {
    this.displayAlert('Visit Saved', 'The visit record has been saved.');
  },

  _saveNewDiagnoses() {
    let diagnoses = this.get('model.diagnoses');
    diagnoses = diagnoses.filterBy('isNew', true);
    if (!isEmpty(diagnoses)) {
      let savePromises = diagnoses.map((diagnoses) => {
        return diagnoses.save();
      });
      return Ember.RSVP.all(savePromises);
    } else {
      return Ember.RSVP.resolve();
    }
  },

  haveAdditionalDiagnoses: function() {
    return !isEmpty(this.get('model.additionalDiagnoses'));
  }.property('model.additionalDiagnoses.[]'),

  afterUpdate() {
    let patient = this.get('model.patient');
    let patientAdmitted = patient.get('admitted');
    let status = this.get('model.status');
    if (status === 'Admitted' && !patientAdmitted) {
      patient.set('admitted', true);
      patient.save().then(this._finishAfterUpdate.bind(this));
    } else if (status === 'Discharged' && patientAdmitted) {
      this.getPatientVisits(patient).then(function(visits) {
        if (isEmpty(visits.findBy('status', 'Admitted'))) {
          patient.set('admitted', false);
          patient.save().then(this._finishAfterUpdate.bind(this));
        } else {
          this._finishAfterUpdate();
        }
      }.bind(this));
    } else {
      this._finishAfterUpdate();
    }
  },

  beforeUpdate() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        let newVisit = this.get('model');
        return newVisit.validate().then(() => {
          if (newVisit.get('isValid')) {
            let patient = newVisit.get('patient');
            if (isEmpty(patient)) {
              this.addNewPatient();
              reject({
                ignore: true,
                message: 'creating new patient first'
              });
            }
            if (this.get('model.checkIn')) {
              let patientId = patient.get('id');
              let maxValue = this.get('maxValue');
              let beginningOfToday = moment().startOf('day').valueOf();
              let endOfToday = moment().endOf('day').valueOf();
              this.store.query('appointment', {
                options: {
                  startkey: [patientId, beginningOfToday, beginningOfToday, 'appointment_'],
                  endkey: [patientId, endOfToday, endOfToday, maxValue]
                },
                mapReduce: 'appointments_by_patient'
              }).then((appointments) => {
                if (isEmpty(appointments)) {
                  newVisit.set('hasAppointment', false);
                  this._saveNewDiagnoses().then(resolve, reject);
                } else {
                  newVisit.set('hasAppointment', true);
                  let appointmentToUpdate = appointments.get('firstObject');
                  appointmentToUpdate.set('status', 'Attended');
                  appointmentToUpdate.save().then(() => {
                    this._saveNewDiagnoses().then(resolve, reject);
                  }, reject);
                }
              }, reject);
            } else {
              this._saveNewDiagnoses().then(resolve, reject);
            }
          }
        });
      });
    } else {
      return this.updateCharges();
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
    addDiagnosis(newDiagnosis) {
      let diagnoses = this.get('model.diagnoses');
      diagnoses.addObject(newDiagnosis);
      let patientDiagnoses = this.get('model.patient.diagnoses');
      let diagnosisExists = patientDiagnoses.any((diagnosis) => {
        return diagnosis.get('active') === true
            && diagnosis.get('diagnosis') === newDiagnosis.get('diagnosis')
            && diagnosis.get('secondaryDiagnosis') === newDiagnosis.get('secondaryDiagnosis');
      });
      if (!diagnosisExists) {
        patientDiagnoses.addObject(newDiagnosis);
        let patient = this.get('model.patient');
        patient.save().then(() => {
          this.send('update', true);
          this.send('closeModal');
        });
      } else {
        this.send('update', true);
        this.send('closeModal');
      }
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

    deleteProcedure(procedure) {
      this.updateList('procedures', procedure, true);
    },

    deleteVitals(vitals) {
      this.updateList('vitals', vitals, true);
    },

    editImaging(imaging) {
      if (imaging.get('canEdit')) {
        imaging.setProperties({
          'returnToVisit': true
        });
      }
      this.transitionToRoute('imaging.edit', imaging);
    },

    editLab(lab) {
      if (lab.get('canEdit')) {
        lab.setProperties({
          'returnToVisit': true
        });
        this.transitionToRoute('labs.edit', lab);
      }
    },

    editMedication(medication) {
      if (medication.get('canEdit')) {
        medication.set('returnToVisit', true);
        this.transitionToRoute('medication.edit', medication);
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

    showDeleteVitals(vitals) {
      this.send('openModal', 'visits.vitals.delete', vitals);
    },

    showEditProcedure(procedure) {
      if (isEmpty(procedure.get('visit'))) {
        procedure.set('visit', this.get('model'));
      }
      procedure.set('returnToVisit', true);
      procedure.set('returnToPatient', false);
      this.transitionToRoute('procedures.edit', procedure);
    },

    showEditVitals(vitals) {
      this.send('openModal', 'visits.vitals.edit', vitals);
    },

    showDeletePatientNote(note) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deletePatientNote',
        title: 'Delete Note',
        message: 'Are you sure you want to delete this note?',
        noteToDelete: note,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    deletePatientNote(model) {
      let note = model.get('noteToDelete');
      let patientNotes = this.get('model.patientNotes');
      patientNotes.removeObject(note);
      this.send('update', true);
    },

    returnToOutPatient() {
      this.transitionToRoute('patients.outpatient');
    }
  }
});
