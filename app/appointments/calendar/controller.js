import { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import moment from 'moment';
import VisitTypes from 'hospitalrun/mixins/visit-types';
import SelectValues from 'hospitalrun/utils/select-values';

export default AppointmentIndexController.extend(AppointmentStatuses, VisitTypes, {
  appointmentType: null,
  endDate: null,
  location: null,
  provider: null,
  queryParams: ['appointmentType', 'endDate', 'provider', 'status', 'startDate', 'location', 'viewType'],
  startDate: null,
  status: null,
  viewType: 'agendaWeek',

  appointmentsController: controller('appointments'),
  locations: alias('appointmentsController.locationList.value'),
  physicians: alias('appointmentsController.physicianList.value'),

  calendarDate: computed('startDate', function() {
    let startDate = get(this, 'startDate');
    if (!isEmpty(startDate)) {
      return moment(parseInt(startDate));
    }
  }),

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
        appointmentType: criteria.type,
        provider: criteria.provider,
        status: criteria.status,
        location: criteria.location
      });
    },

    handleVisualConfigurationChanged(newConfiguration) {
      this.setProperties(newConfiguration);
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
      appointmentToUpdate.save().catch((error) => {
        this.send('error', error, 'appointments.calendar');
      });
    }
  }
});
