import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
export default AbstractPagedController.extend(PatientVisits, {
  addPermission: 'add_patient',
  deletePermission: 'delete_patient',
  canAddVisit: function() {
    return this.currentUserCan('add_visit');
  }.property(),

  startKey: [],
  actions: {
    editVisit: function(visit) {
      if (this.get('canAddVisit')) {
        this.transitionToRoute('visits.edit', visit);
      }
    },

    patientCheckIn: function() {
      this.transitionToRoute('visits.edit', 'checkin');
    }

  }
});
