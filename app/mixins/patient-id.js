import Ember from "ember";
export default Ember.Mixin.create({
    idPrefix: null,
    
    _createId: function(patientSequence) {
        var idPrefix = this.get('idPrefix'),
            newId;
        if (patientSequence < 100000) {
            newId = idPrefix + String('00000' + patientSequence).slice(-5);
        } else {
            newId = String(idPrefix + patientSequence);
        }
        return newId;
    },
    
    _findUnusedId: function(patientSequence, patientSequenceRecord, resolve, reject) {
        patientSequence++;
        var newId = this._createId(patientSequence);
        
        this.store.find('patient',newId).then(function() {
            this._findUnusedId(patientSequence, patientSequenceRecord, resolve, reject);
        }.bind(this), function(err) {
            console.log("GOT ERR", err);
            if (Ember.isEmpty(patientSequenceRecord)) {
                patientSequenceRecord = this.store.createRecord('config', {
                    id: 'patient_sequence'
                });
            }
            patientSequenceRecord.set('value', patientSequence);
            patientSequenceRecord.save().then(function() {
                resolve(newId);
            }, reject);                    
        }.bind(this));
    },
    
    /**
     * Override this function to generate an id for a new record
     * @return a generated id;default is null which means that an
     * id will be automatically generated via Ember data.
     */
    generateId: function() {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var configs = this.modelFor('application'),
                sessionVars = this.get('session').store.restore(),
                patientSequence = 0,
                patientSequenceRecord = configs.findBy('id','patient_sequence');
            this.set('idPrefix', sessionVars.prefix+'_');
            if (!Ember.isEmpty(patientSequenceRecord)) {
                patientSequence = patientSequenceRecord.get('value');
            }
            this._findUnusedId(patientSequence, patientSequenceRecord, resolve, reject);
        }.bind(this));
    }
});