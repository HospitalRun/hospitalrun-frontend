import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import VisitTypes from 'hospitalrun/mixins/visit-types';
import SelectValues from 'hospitalrun/utils/select-values';
import Ember from 'ember';

const {
  computed,
  computed: {
    alias
  },
  get,
  inject,
  isEmpty,
  set
} = Ember;

export default AppointmentIndexController.extend(AppointmentStatuses, VisitTypes, {
  appointmentType: null,
  location: null,
  provider: null,
  queryParams: ['appointmentType', 'provider', 'status', 'location'],
  startKey: [],
  status: null,

  appointmentsController: inject.controller('appointments'),
  locations: alias('appointmentsController.locationList.value'),
  physicians: alias('appointmentsController.physicianList.value'),

  locationList: computed('locations', function() {
    return SelectValues.selectValues(get(this, 'locations'), true);
  }),

  physicianList: computed('physicians', function() {
    return SelectValues.selectValues(get(this, 'physicians'), true);
  }),

  _getSelectedFilteringCriteria() {
    let rawCriteria = {
      status: get(this, 'model.selectedStatus'),
      type: get(this, 'model.selectedAppointmentType'),
      provider: get(this, 'model.selectedProvider'),
      location: get(this, 'model.selectedLocation')
    };

    return {
      status: isEmpty(rawCriteria.status) ? null : rawCriteria.status,
      type: isEmpty(rawCriteria.type) ? null : rawCriteria.type,
      provider: isEmpty(rawCriteria.provider) ? null : rawCriteria.provider,
      location: isEmpty(rawCriteria.location) ? null : rawCriteria.location
    };
  },

  actions: {
    clearFilteringCriteria() {
      set(this, 'model.selectedStatus', null);
      set(this, 'model.selectedAppointmentType', null);
      set(this, 'model.selectedProvider', null);
      set(this, 'model.selectedLocation', null);
      this.send('filter');
    },

    createNewAppointment(dateClicked) {
      let newAppointment = this.store.createRecord('appointment', {
        appointmentType: 'Admission',
        allDay: false,
        selectPatient: true,
        startDate: dateClicked.local().toDate()
      });
      this.send('editAppointment', newAppointment);
    },

    filter() {
      let criteria = this._getSelectedFilteringCriteria();
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

    handleVisualConfigurationChanged(newConfiguration) {
      let { dateIntervalStart, dateIntervalEnd } = newConfiguration;
      this.send('updateDateInterval', dateIntervalStart, dateIntervalEnd);
    },

    navigateToAppointment(calendarEvent) {
      this.send('editAppointment', calendarEvent.referencedAppointment);
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
