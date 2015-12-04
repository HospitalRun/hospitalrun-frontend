import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import PatientVisitTypes from 'hospitalrun/mixins/patient-visit-types';
export default Ember.Controller.extend(PatientDiagnosis, PatientVisits, PatientVisitTypes, {
  
  title: function() {
    return 'Patient History for ' + this.get('model.displayName') + ' [' + this.get('model.displayPatientId') + '] on ' + (moment().format('MM/DD/YYYY'));
  }.property('model.displayName', 'model.displayPatientId'),
  
  actions: {
    cancel: function() {
      this.send('closeModal');
    }
  },
  
  setupController: function(controller, model) {
    // Load appointments, photos and visits asynchronously.
    this._super(controller, model);
    this.getPatientVisits(model).then(function(visits) {
      model.set('visits', visits);
    });
  }
});