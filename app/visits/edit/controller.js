import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AddNewPatient from 'hospitalrun/mixins/add-new-patient';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import DiagnosisActions from 'hospitalrun/mixins/diagnosis-actions';
import Ember from 'ember';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitStatus from 'hospitalrun/utils/visit-statuses';
import VisitTypes from 'hospitalrun/mixins/visit-types';

const {
  computed,
  isEmpty
} = Ember;

export default AbstractEditController.extend(AddNewPatient, ChargeActions, DiagnosisActions, PatientSubmodule, PatientNotes, UserSession, VisitTypes, {
  visitsController: Ember.inject.controller('visits'),
  additionalButtons: computed('model.status', function() {
    let buttonProps = {
      buttonIcon: 'glyphicon glyphicon-log-out',
      class: 'btn btn-primary on-white'
    };
    let i18n = this.get('i18n');
    let status = this.get('model.status');
    if (status === VisitStatus.ADMITTED) {
      buttonProps.buttonAction = 'discharge';
      buttonProps.buttonText = i18n.t('visits.buttons.discharge');
      return [buttonProps];
    } else if (status === VisitStatus.CHECKED_IN) {
      buttonProps.buttonAction = 'checkout';
      buttonProps.buttonText = i18n.t('visits.buttons.checkOut');
      return [buttonProps];
    }
  }),

  canAddAppointment: computed('model.isNew', function() {
    return (!this.get('model.isNew') && this.currentUserCan('add_appointment'));
  }),

  canAddBillingDiagnosis: computed('model.isNew', function() {
    return (!this.get('model.isNew') && this.currentUserCan('add_billing_diagnosis'));
  }),

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

  isAdmissionVisit: function() {
    let visitType = this.get('model.visitType');
    let isAdmission = (visitType === 'Admission');
    return isAdmission;
  }.property('model.visitType'),

  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (!isEmpty(returnTo)) {
      return 'returnTo';
    } else if (!isEmpty(this.get('model.returnToPatient'))) {
      return 'returnToPatient';
    } else {
      return this._super();
    }
  }.property('model.returnTo', 'model.returnToPatient'),

  allowAddAllergy: computed.not('model.isNew'),
  allowAddDiagnosis: computed.not('model.isNew'),
  allowAddOperativePlan: computed.not('model.isNew'),
  chargePricingCategory: 'Ward',
  chargeRoute: 'visits.charge',
  createNewPatient: false,
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
  sexList: computed.alias('visitsController.sexList'),
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

  updateCapability: 'add_visit',

  showPatientSelection: computed('model.checkIn', 'model.hidePatientSelection', function() {
    return this.get('model.checkIn') && !this.get('model.hidePatientSelection');
  }),

  updateButtonIcon: computed('model.checkIn', function() {
    if (this.get('model.checkIn')) {
      return 'glyphicon glyphicon-log-in';
    }
  }),

  updateButtonText: function() {
    let i18n = this.get('i18n');
    if (this.get('model.checkIn')) {
      return i18n.t('visits.buttons.checkIn');
    } else {
      return this._super();
    }
  }.property('model.checkIn'),

  validVisitTypes: function() {
    let outPatient = this.get('model.outPatient');
    let visitTypes = this.get('visitTypes');
    if (outPatient === true) {
      visitTypes = visitTypes.filter(function(visitType) {
        return (visitType.id !== 'Admission');
      });
    }
    return visitTypes;
  }.property('visitTypes', 'model.outPatient'),

  _addChildObject(route, afterTransition) {
    this.transitionToRoute(route, 'new').then(function(newRoute) {
      newRoute.currentModel.setProperties({
        patient: this.get('model.patient'),
        visit: this.get('model'),
        selectPatient: false,
        returnToVisit: this.get('model.id')
      });
      if (afterTransition) {
        afterTransition(newRoute);
      }
    }.bind(this));
  },

  _finishAfterUpdate() {
    let addedNewPatient = this.get('addedNewPatient');
    let checkIn = this.get('model.checkIn');
    let i18n = this.get('i18n');
    let updateMesage = i18n.t('visits.messages.visitSaved');
    let updateTitle = i18n.t('visits.titles.visitSaved');
    if (checkIn === true) {
      let model = this.get('model');
      model.set('checkIn');
      this.send('setSectionHeader', {
        currentScreenTitle: i18n.t('visits.titles.editVisit')
      });
    }

    if (checkIn) {
      updateTitle = i18n.t('visits.titles.checkedIn');
      let patientDetails = {
        patientName: this.get('model.patient.displayName')
      };
      if (addedNewPatient === true) {
        this.set('addedNewPatient');
        updateMesage = i18n.t('visits.messages.patientCreatedAndCheckedIn', patientDetails);
      } else {
        updateMesage = i18n.t('visits.messages.patientCheckedIn', patientDetails);
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
      return Ember.RSVP.resolve(appointment);
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
        return Ember.RSVP.resolve();
      } else {
        newVisit.set('hasAppointment', true);
        appointment.set('status', 'Attended');
        return appointment.save();
      }
    });
  },

  haveAdditionalDiagnoses: function() {
    return !isEmpty(this.get('model.additionalDiagnoses'));
  }.property('model.additionalDiagnoses.[]'),

  afterUpdate(visit) {
    this.updatePatientVisitFlags(visit).then(this._finishAfterUpdate.bind(this));
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
              return reject({
                ignore: true,
                message: 'creating new patient first'
              });
            }
            let visitType = newVisit.get('visitType');
            let visitStatus;
            if (visitType === 'Admission') {
              visitStatus = VisitStatus.ADMITTED;
            } else {
              visitStatus = VisitStatus.CHECKED_IN;
            }
            newVisit.set('status', visitStatus);
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
      this.set('createNewPatient', true);
    } else {
      this.set('createNewPatient', false);
      this.getPatientDiagnoses(patient);
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
      this.addDiagnosisToModelAndPatient(newDiagnosis);
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

    deleteProcedure(procedure) {
      this.updateList('procedures', procedure, true);
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
          route.controller.getPatientDiagnoses(this.get('model.patient'));
        });
      } else {
        model.set('returnToVisit', this.get('model.id'));
        this.transitionToRoute('patients.operative-plan', model);
      }
    },

    newPatientChanged(createNewPatient) {
      this.set('createNewPatient', createNewPatient);
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
      procedure.set('returnToVisit', this.get('model.id'));
      procedure.set('returnToPatient');
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

    startDateChanged(startDate) {
      let isAdmissionVisit = this.get('isAdmissionVisit');
      let visit = this.get('model');
      if (!isAdmissionVisit) {
        visit.set('endDate', startDate);
      }
    }

  }
});
