import Ember from "ember";
export default Ember.Mixin.create({
    _createId: function(idPrefix, patientSequence) {
        var newId;
        if (patientSequence < 100000) {
            newId = idPrefix + String('00000' + patientSequence).slice(-5);
        } else {
            newId = String(idPrefix + patientSequence);
        }
        return newId;
    },
    
    /**
     * Override this function to generate an id for a new record
     * @return a generated id;default is null which means that an
     * id will be automatically generated via Ember data.
     */
    generateId: function() {
        var existingRecord = true,
            configs = this.modelFor('application'),
            sessionVars = this.get('session').store.restore(),
            idPrefix = sessionVars.prefix+'_',
            newId,
            patientSequence = 0,
            patientSequenceRecord = configs.findBy('id','patient_sequence');
        
        if (!Ember.isEmpty(patientSequenceRecord)) {
            patientSequence = patientSequenceRecord.get('value');
        }
        while (!Ember.isEmpty(existingRecord)) {
            patientSequence++;
            newId = this._createId(idPrefix, patientSequence);
            existingRecord = this.modelFor('patients').findBy('id',newId);
        }
        if (Ember.isEmpty(patientSequenceRecord)) {
            patientSequenceRecord = this.store.createRecord('config', {
                id: 'patient_sequence'
            });
        }
        patientSequenceRecord.set('value', patientSequence);
        patientSequenceRecord.save();
        return newId;
    }
});