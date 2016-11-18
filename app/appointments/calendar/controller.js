import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
export default AppointmentIndexController.extend({
  startKey: [],

  queryParams: ["startDate", "endDate"],
  startDate: null,
  endDate: null,

  calendarHeader: {
    left: 'title',
    center: 'agendaDay,agendaWeek,month',
    right: 'today prev,next'
  },

  actions: {
    navigateToAppointment(calendarEvent) {
      this.send("editAppointment", calendarEvent.appointment);
    },

    handleSelectedDateChange(view) {
      let newIntervalStart = moment(view.intervalStart.format()).startOf("day").toDate().getTime();
      let newIntervalEnd = moment(view.intervalEnd.format()).endOf("day").toDate().getTime();
      if (newIntervalStart !== this.get("startDate") || newIntervalEnd !== this.get("endDate")) {
        this.setProperties({
          startDate: newIntervalStart,
          endDate: newIntervalEnd
        });
      }
    },

    filter() {
    }
  }
});
