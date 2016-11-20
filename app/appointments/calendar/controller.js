import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
export default AppointmentIndexController.extend({
  startKey: [],

  actions: {
    navigateToAppointment(calendarEvent) {
      this.send('editAppointment', calendarEvent.referencedAppointment);
    },

    handleVisibleDateIntervalChanged(start, end) {
      this.send('updateDateInterval', start, end);
    },

    filter() {
    }
  }
});
