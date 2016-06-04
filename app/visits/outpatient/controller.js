import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from 'ember';

export default AbstractPagedController.extend({
  deletePermission: 'delete_patient',
  canDischargePatient: function() {
    return this.currentUserCan('discharge_patient');
  }.property(),

  actions: {
    dischargePatient: function(visit) {
      visit.set('status', 'Discharged');
      visit.set('endDate', new Date());
      this.transitionToRoute('visits.edit', visit);
    }
  }
});
