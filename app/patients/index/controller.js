import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import VisitStatus from 'hospitalrun/utils/visit-statuses';
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
    checkInPatient(patient) {
      this.send('createNewVisit', patient);
    },

    checkoutPatient(patient) {
      this.editPatientVisitWithStatus(patient, VisitStatus.CHECKED_IN);
    },

    dischargePatient(patient) {
      this.editPatientVisitWithStatus(patient, VisitStatus.ADMITTED);
    }
  },

  editPatientVisitWithStatus(patient, status) {
    this.getPatientVisits(patient).then((visits) => {
      let visitToEdit = visits.findBy('status', status);
      if (visitToEdit) {
        visitToEdit.set('endDate', new Date());
        this.transitionToRoute('visits.edit', visitToEdit);
      }
    });
  }
});
