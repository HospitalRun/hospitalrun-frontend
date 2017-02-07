import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import VisitTypes from 'hospitalrun/mixins/visit-types';

const {
  computed,
  computed: {
    alias
  },
  get,
  inject,
  set
} = Ember;

export default AbstractEditController.extend(AppointmentStatuses, PatientSubmodule, VisitTypes, {
  findPatientVisits: false,
  updateCapability: 'add_appointment',

  appointmentsController: inject.controller('appointments'),
  physicianList: alias('appointmentsController.physicianList'),
  surgeryLocationList: alias('appointmentsController.surgeryLocationList'),
  visitLocationList: alias('appointmentsController.locationList'),
  visitTypesList: alias('appointmentsController.visitTypesList'),

  cancelAction: computed('model.returnTo', function() {
    let returnTo = get(this, 'model.returnTo');
    if (Ember.isEmpty(returnTo)) {
      return this._super();
    } else {
      return 'returnTo';
    }
  }),

  isAdmissionAppointment: computed('model.appointmentType', function() {
    let model = get(this, 'model');
    let appointmentType = get(model, 'appointmentType');
    let isAdmissionAppointment = (appointmentType === 'Admission');
    return isAdmissionAppointment;
  }),

  lookupListsToUpdate: computed('model.appointmentType', function() {
    let appointmentType = get(this, 'model.appointmentType');
    let lists =   [{
      name: 'physicianList',
      property: 'model.provider',
      id: 'physician_list'
    }];
    if (appointmentType === 'Surgery') {
      lists.push({
        name: 'visitLocationList',
        property: 'model.location',
        id: 'visit_location_list'
      });
    } else {
      lists.push({
        name: 'surgeryLocationList',
        property: 'model.location',
        id: 'procedure_locations'
      });
    }
  }),

  showTime: computed('model.allDay', 'isAdmissionAppointment', function() {
    let allDay = get(this, 'model.allDay');
    let isAdmissionAppointment = get(this, 'isAdmissionAppointment');
    return (!allDay && isAdmissionAppointment);
  }),

  afterUpdate(model) {
    let i18n = get(this, 'i18n');
    let patientInfo = {
      patient: get(model, 'patient.displayName')
    };
    let message = i18n.t('appointments.messages.appointmentSaved', patientInfo);
    let title = i18n.t('appointments.titles.appointmentSaved');
    this.displayAlert(title, message);
  },

  actions: {
    appointmentTypeChanged(appointmentType) {
      let model = get(this, 'model');
      set(model, 'appointmentType', appointmentType);
      let isAdmissionAppointment = get(this, 'isAdmissionAppointment');
      set(model, 'allDay', isAdmissionAppointment);
    }
  }
});
