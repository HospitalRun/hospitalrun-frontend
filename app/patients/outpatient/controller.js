import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import UserSession from 'hospitalrun/mixins/user-session';
import PatientVisits from 'hospitalrun/mixins/patient-visits';

export default AbstractEditController.extend(PatientVisits, UserSession, {

  canAddVisit: function() {
    return this.currentUserCan('add_visit');
  }.property(),

  canDischargePatient: function() {
    return this.currentUserCan('discharge_patient');
  }.property(),

  canDelete: function() {
    return this.currentUserCan('delete_patient');
  }.property(),

  actions: {
    editVisit: function(visit) {
      if (this.get('canAddVisit')) {
        this.transitionToRoute('visits.edit', visit);
      }
    },
    dischargePatient: function(patient) {
      this.getPatientVisits(patient).then(function(visits) {
        let visitToDischarge = visits.findBy('status', 'Admitted');
        if (visitToDischarge) {
          visitToDischarge.set('status', 'Discharged');
          visitToDischarge.set('endDate', new Date());
          this.transitionToRoute('visits.edit', visitToDischarge);
        }
      }.bind(this));
    }
  }
});
