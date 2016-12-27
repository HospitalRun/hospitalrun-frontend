import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

export default AbstractPagedController.extend({
  visitsController: Ember.inject.controller('visits'),

  addPermission: 'add_patient',
  deletePermission: 'delete_patient',
  canDischargePatient: function() {
    return this.currentUserCan('discharge_patient');
  }.property(),

  outPatientVisits: function() {
    var visits = this.get('model');
    return visits.filter(function(visit) {
      var visitType = visit.get('visitType');
      var status = visit.get('status');
      return (visitType === 'Followup') || (visitType === 'Clinic') && (status !== 'Discharged');
    });
  }.property('model'),

  startDate: null,
  examiner: null,
  physicians: Ember.computed.alias('visitsController.physicianList.value'),
  physicianList: function() {
    return SelectValues.selectValues(this.get('physicians'), true);
  }.property('physicians'),

  actions: {
    dischargePatient: function(visit) {
      visit.set('visitType', 'Admission');
      visit.set('status', 'Discharged');
      visit.set('endDate', new Date());
      this.transitionToRoute('visits.edit', visit);
    },
    search: function() {
    }
  }
});
