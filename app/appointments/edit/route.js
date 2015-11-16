import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(PatientListRoute, {
  editTitle: 'Edit Appointment',
  modelName: 'appointment',
  newTitle: 'New Appointment',

  getNewData: function() {
    return Ember.RSVP.resolve({
      appointmentType: 'Admission',
      allDay: true,
      selectPatient: true,
      startDate: new Date()
    });
  }
});
