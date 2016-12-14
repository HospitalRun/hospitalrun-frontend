import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(AppointmentStatuses, PatientSubmodule, VisitTypes, {
  appointmentsController: Ember.inject.controller('appointments'),
  findPatientVisits: false,

  locationList: Ember.computed.alias('appointmentsController.locationList'),

  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.provider',
    id: 'physician_list'
  }, {
    name: 'locationList',
    property: 'model.location',
    id: 'visit_location_list'
  }],

  physicianList: Ember.computed.alias('appointmentsController.physicianList'),
  showTime: function() {
    let allDay = this.get('model.allDay');
    let isAdmissionAppointment = this.get('isAdmissionAppointment');
    return (!allDay && isAdmissionAppointment);
  }.property('model.allDay', 'isAdmissionAppointment'),
  visitTypesList: Ember.computed.alias('appointmentsController.visitTypesList'),

  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (Ember.isEmpty(returnTo)) {
      return this._super();
    } else {
      return 'returnTo';
    }
  }.property('model.returnTo'),

  isAdmissionAppointment: function() {
    let model = this.get('model');
    let appointmentType = model.get('appointmentType');
    let isAdmissionAppointment = (appointmentType === 'Admission');
    return isAdmissionAppointment;
  }.property('model.appointmentType'),

  updateCapability: 'add_appointment',

  afterUpdate() {
    this.send(this.get('cancelAction'));
  },

  actions: {
    appointmentTypeChanged(appointmentType) {
      let model = this.get('model');
      model.set('appointmentType', appointmentType);
      let isAdmissionAppointment = this.get('isAdmissionAppointment');
      model.set('allDay', isAdmissionAppointment);
    }
  }
});
