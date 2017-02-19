import AppointmenCalendarController from 'hospitalrun/appointments/calendar/controller';

export default AppointmenCalendarController.extend({
  dayGroupByResource: {
    day: {
      groupByResource: true
    }
  },

  actions: {
    createNewAppointment(dateClicked) {
      let newAppointment = this.store.createRecord('appointment', {
        appointmentType: 'Surgery',
        selectPatient: true,
        startDate: dateClicked.local().toDate(),
        endDate: dateClicked.add('1', 'hours').local().toDate()
      });
      this.send('editAppointment', newAppointment);
    }
  }
});
