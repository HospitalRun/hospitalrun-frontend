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
        var pouchDBController = this.controllerFor('pouchdb');
        pouchDBController.queryMainDB(patientQuery).then(function(result) {    
            if (result.rows) {
                var list = result.rows.map(function(row) {
                    var rowValues = row.doc.data;
                    rowValues.id = pouchDBController.getLocalDocID(row.id);
                    return rowValues;
                });
                controller.set('patientList', list);
            }            
        });
    },
    
    setupController: function(controller, model) {
        this._super(controller, model);
        this._fetchPatientList(controller);
    }
});