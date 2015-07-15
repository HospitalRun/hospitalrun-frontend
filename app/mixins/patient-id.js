import Ember from "ember";
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
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
    
    _findUnusedId: function(patientSequenceRecord, resolve, reject) {
        var patientSequence = patientSequenceRecord.incrementProperty('value'),
            maxValue = this.get('maxValue'),
            newId = this._createId(patientSequence),
            queryParams = {
                startkey: [newId,null],
                endkey: [newId, maxValue],    
            },
            pouchdbController = this._getPouchDBController();
        pouchdbController.queryMainDB(queryParams, 'patient_by_display_id').then(function(foundRecord) {
            if (!Ember.isEmpty(foundRecord.rows)) {
                this._findUnusedId(patientSequenceRecord, resolve, reject);
            } else {
                patientSequenceRecord.set('value', patientSequence);
                patientSequenceRecord.save().then(function() {
                    resolve(newId);
                }, reject);
            }
        }.bind(this), reject);
    },
    
    /**
     * Since this mixin is used by both routes and controllers, try to get the pouchdb controller from the controllers property; 
     * otherwise use controllerFor.
     */ 
    _getPouchDBController: function() {
        var pouchDBController = this.get('controllers.pouchdb');
        if (Ember.isEmpty(pouchDBController)) {
            pouchDBController =  this.controllerFor('pouchdb');
        }
        return pouchDBController;
    },
    
    /**
     * Override this function to generate an id for a new record
     * @return a generated id;default is null which means that an
     * id will be automatically generated via Ember data.
     */
    generateFriendlyId: function(configs) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var idPrefix = 'P',
                idPrefixRecord;
            if (Ember.isEmpty(configs)) {
                 configs = this.modelFor('application');
            }
             idPrefixRecord = configs.findBy('id','patient_id_prefix');
            if (!Ember.isEmpty(idPrefixRecord)) {
                idPrefix = idPrefixRecord.get('value');
            }
            this.set('idPrefix', idPrefix);
            
            this.store.find('sequence', 'patient').then(function(sequence) {
                this._findUnusedId(sequence, resolve, reject);
            }.bind(this), function() {
                var newSequence = this.get('store').push('sequence',{
                    id: 'patient',
                    value: 0
                });
                this._findUnusedId(newSequence, resolve, reject);
            }.bind(this));
        }.bind(this));
    }
});