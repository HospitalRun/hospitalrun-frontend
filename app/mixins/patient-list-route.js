import Ember from "ember";
export default Ember.Mixin.create({
    /**
     * Lazily load patient list so that it doesn't impact performance.
     */    
    _fetchPatientList: function(controller) {
        var patientQuery = {
            startkey:  'patient_',
            endkey: 'patient_\uffff',
            include_docs: true,
        };
        this.controllerFor('pouchdb').queryMainDB(patientQuery).then(function(result) {
            controller.set('patientList', result.rows);
        });
    },
    
    setupController: function(controller, model) {
        this._super(controller, model);
        this._fetchPatientList(controller);
    }
});