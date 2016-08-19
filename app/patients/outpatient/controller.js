import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
export default AbstractPagedController.extend(PatientVisits, {
  addPermission: 'add_patient',
  deletePermission: 'delete_patient',
  canAdmitPatient: function() {
    return this.currentUserCan('admit_patient');
  }.property(),

  canDischargePatient: function() {
    return this.currentUserCan('discharge_patient');
  }.property(),

  startKey: [],
  actions: {

    patientCheckIn: function() {
      this.transitionToRoute('visits.edit', 'checkin');
    }

  }
});
