import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import VisitTypes from 'hospitalrun/mixins/visit-types';
import SelectValues from 'hospitalrun/utils/select-values';
import Ember from 'ember';

const {
  set
} = Ember;

export default AppointmentIndexController.extend(AppointmentStatuses, VisitTypes, {
  appointmentsController: Ember.inject.controller('appointments'),
  startKey: [],

  queryParams: ['appointmentType', 'provider', 'status', 'location'],
  appointmentType: null,
  provider: null,
  status: null,
  location: null,

  physicians: Ember.computed.alias('appointmentsController.physicianList.value'),
  physicianList: function() {
    return SelectValues.selectValues(this.get('physicians'), true);
  }.property('physicians'),

  locations: Ember.computed.alias('appointmentsController.locationList.value'),
  locationList: function() {
    return SelectValues.selectValues(this.get('locations'), true);
  }.property('locations'),

  getSelectedFilteringCriteria() {
    let rawCriteria = {
      status: this.get('model.selectedStatus'),
      type: this.get('model.selectedAppointmentType'),
      provider: this.get('model.selectedProvider'),
      location: this.get('model.selectedLocation')
    };

    return {
      status: Ember.isEmpty(rawCriteria.status) ? null : rawCriteria.status,
      type: Ember.isEmpty(rawCriteria.type) ? null : rawCriteria.type,
      provider: Ember.isEmpty(rawCriteria.provider) ? null : rawCriteria.provider,
      location: Ember.isEmpty(rawCriteria.location) ? null : rawCriteria.location
    };
  },

  actions: {
    createNewAppointment(dateClicked) {
      let newAppointment = this.store.createRecord('appointment', {
        appointmentType: 'Admission',
        allDay: false,
        selectPatient: true,
        startDate: dateClicked.local().toDate()
      });
      this.send('editAppointment', newAppointment);
    },

    navigateToAppointment(calendarEvent) {
      this.send('editAppointment', calendarEvent.referencedAppointment);
    },

    handleVisualConfigurationChanged(newConfiguration) {
      let { dateIntervalStart, dateIntervalEnd } = newConfiguration;
      this.send('updateDateInterval', dateIntervalStart, dateIntervalEnd);
    },

    filter() {
      let criteria = this.getSelectedFilteringCriteria();
      this.setProperties({
        startKey: [],
        previousStartKey: null,
        previousStartKeys: [],

        appointmentType: criteria.type,
        provider: criteria.provider,
        status: criteria.status,
        location: criteria.location
      });
    },

    clearFilteringCriteria() {
      this.set('model.selectedStatus', null);
      this.set('model.selectedAppointmentType', null);
      this.set('model.selectedProvider', null);
      this.set('model.selectedLocation', null);
      this.send('filter');
    },

    updateAppointment(calendarEvent) {
      let appointmentToUpdate = calendarEvent.referencedAppointment;
      let newEnd = calendarEvent.end.local().toDate();
      let newStart = calendarEvent.start.local().toDate();
      set(appointmentToUpdate, 'startDate', newStart);
      set(appointmentToUpdate, 'endDate', newEnd);
      this.send('editAppointment', appointmentToUpdate);
    }
  }
});
