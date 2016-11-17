import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
export default AppointmentIndexController.extend({
  startKey: [],

  calendarHeader: {
    left: 'title',
    center: 'agendaDay,agendaWeek,month',
    right: 'today prev,next'
  },

  actions: {
    navigateToAppointment(calendarEvent) {
      this.send("editAppointment", calendarEvent.appointment);
    }
  }
});
