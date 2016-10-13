import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, PatientNotes, UserSession, VisitTypes, {
  visitsController: Ember.inject.controller('visits'),

  canAddAppointment: function() {
    return this.currentUserCan('add_appointment');
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

  canAddDiagnosis: function() {
    return this.currentUserCan('add_diagnosis');
  }.property(),

  canAddProcedure: function() {
    return this.currentUserCan('add_procedure');
  }.property(),

  canAddVitals: function() {
    return this.currentUserCan('add_vitals');
  }.property(),

  canDeleteDiagnosis: function() {
    return this.currentUserCan('delete_diagnosis');
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

  cancelAction: 'returnToPatient',
  chargePricingCategory: 'Ward',
  chargeRoute: 'visits.charge',
  diagnosisList: Ember.computed.alias('visitsController.diagnosisList'),
  findPatientVisits: false,
  patientImaging: Ember.computed.alias('model.imaging'),
  patientLabs: Ember.computed.alias('model.labs'),
  patientMedications: Ember.computed.alias('model.medication'),
  pricingList: null, // This gets filled in by the route
  pricingTypes: Ember.computed.alias('visitsController.wardPricingTypes'),
  physicianList: Ember.computed.alias('visitsController.physicianList'),
  locationList: Ember.computed.alias('visitsController.locationList'),
  visitTypesList: Ember.computed.alias('visitsController.visitTypesList'),
  lookupListsToUpdate: [{
    name: 'diagnosisList',
    property: 'model.primaryBillingDiagnosis',
    id: 'diagnosis_list'
  }, {
    name: 'diagnosisList',
    property: 'model.primaryDiagnosis',
    id: 'diagnosis_list'
  }, {
    name: 'physicianList',
    property: 'model.examiner',
    id: 'physician_list'
  }, {
    name: 'locationList',
    property: 'model.location',
    id: 'visit_location_list'
  }],

  newVisit: false,
  visitStatuses: [
    'Admitted',
    'Discharged'
  ].map(SelectValues.selectValuesMap),

  updateCapability: 'add_visit',

  _addChildObject: function(route) {
    this.transitionToRoute(route, 'new').then(function(newRoute) {
      newRoute.currentModel.setProperties({
        patient: this.get('model.patient'),
        visit: this.get('model'),
        selectPatient: false,
        returnToVisit: true
      });
    }.bind(this));
  },

  _finishAfterUpdate: function() {
    this.displayAlert('Visit Saved', 'The visit record has been saved.');
  },

  haveAdditionalDiagnoses: function() {
    return !Ember.isEmpty(this.get('model.additionalDiagnoses'));
  }.property('model.additionalDiagnoses.[]'),

  afterUpdate: function() {
    let patient = this.get('model.patient');
    let patientAdmitted = patient.get('admitted');
    let status = this.get('model.status');
    if (status === 'Admitted' && !patientAdmitted) {
      patient.set('admitted', true);
      patient.save().then(this._finishAfterUpdate.bind(this));
    } else if (status === 'Discharged' && patientAdmitted) {
      this.getPatientVisits(patient).then(function(visits) {
        if (Ember.isEmpty(visits.findBy('status', 'Admitted'))) {
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

  beforeUpdate: function() {
    if (this.get('model.isNew')) {
      this.set('newVisit', true);
    }
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this.updateCharges().then(resolve, reject);
    }.bind(this));
  },

  /**
   * Adds or removes the specified object from the specified list.
   * @param {String} listName The name of the list to operate on.
   * @param {Object} listObject The object to add or removed from the
   * specified list.
   * @param {boolean} removeObject If true remove the object from the list;
   * otherwise add the specified object to the list.
   */
  updateList: function(listName, listObject, removeObject) {
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
    addDiagnosis: function(newDiagnosis) {
      let additionalDiagnoses = this.get('model.additionalDiagnoses');
      let visit = this.get('model');
      if (!Ember.isArray(additionalDiagnoses)) {
        additionalDiagnoses = [];
      }
      additionalDiagnoses.addObject(newDiagnosis);
      visit.set('additionalDiagnoses', additionalDiagnoses);
      this.send('update', true);
      this.send('closeModal');
    },

    deleteDiagnosis: function(diagnosis) {
      let additionalDiagnoses = this.get('model.additionalDiagnoses');
      let visit = this.get('model');
      additionalDiagnoses.removeObject(diagnosis);
      visit.set('additionalDiagnoses', additionalDiagnoses);
      this.send('update', true);
    },

    addVitals: function(newVitals) {
      this.updateList('vitals', newVitals);
    },

    cancel: function() {
      let cancelledItem = this.get('model');
      if (this.get('model.isNew')) {
        cancelledItem.deleteRecord();
      } else {
        cancelledItem.rollbackAttributes();
      }
      this.send(this.get('cancelAction'));
    },

    deleteProcedure: function(procedure) {
      this.updateList('procedures', procedure, true);
    },

    deleteVitals: function(vitals) {
      this.updateList('vitals', vitals, true);
    },

    editImaging: function(imaging) {
      if (imaging.get('canEdit')) {
        imaging.setProperties({
          'returnToVisit': true
        });
      }
      this.transitionToRoute('imaging.edit', imaging);
    },

    editLab: function(lab) {
      if (lab.get('canEdit')) {
        lab.setProperties({
          'returnToVisit': true
        });
        this.transitionToRoute('labs.edit', lab);
      }
    },

    editMedication: function(medication) {
      if (medication.get('canEdit')) {
        medication.set('returnToVisit', true);
        this.transitionToRoute('medication.edit', medication);
      }
    },

    showAddVitals: function() {
      let newVitals = this.get('store').createRecord('vital', {
        dateRecorded: new Date()
      });
      this.send('openModal', 'visits.vitals.edit', newVitals);
    },

    showAddPatientNote: function(model) {
      if (Ember.isEmpty(model)) {
        model = this.get('store').createRecord('patient-note', {
          visit: this.get('model'),
          createdBy: this.getUserName(),
          patient: this.get('model').get('patient'),
          noteType: this._computeNoteType(this.get('model'))
        });
      }
      this.send('openModal', 'patients.notes', model);
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

    showAddDiagnosis: function() {
      let newDiagnosis = this.get('store').createRecord('add-diagnosis');
      this.send('openModal', 'visits.add-diagnosis', newDiagnosis);
    },

    showAddProcedure: function() {
      this._addChildObject('procedures.edit');
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

    showDeleteProcedure: function(procedure) {
      this.send('openModal', 'visits.procedures.delete', procedure);
    },

    showDeleteVitals: function(vitals) {
      this.send('openModal', 'visits.vitals.delete', vitals);
    },

    showEditProcedure: function(procedure) {
      if (Ember.isEmpty(procedure.get('visit'))) {
        procedure.set('visit', this.get('model'));
      }
      procedure.set('returnToVisit', true);
      procedure.set('returnToPatient', false);
      this.transitionToRoute('procedures.edit', procedure);
    },

    showEditVitals: function(vitals) {
      this.send('openModal', 'visits.vitals.edit', vitals);
    },

    showDeletePatientNote: function(note) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deletePatientNote',
        title: 'Delete Note',
        message: 'Are you sure you want to delete this note?',
        noteToDelete: note,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
      }));
    },

    deletePatientNote: function(model) {
      let note = model.get('noteToDelete');
      let patientNotes = this.get('model.patientNotes');
      patientNotes.removeObject(note);
      this.send('update', true);
    }
  }
});
