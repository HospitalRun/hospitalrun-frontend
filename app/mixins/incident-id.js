import Ember from 'ember';
export default Ember.Mixin.create({
  idPrefix: null,

  _createId: function(incidentSequence) {
    var idPrefix = this.get('idPrefix'),
        newId;
    if (incidentSequence < 100000) {
      newId = idPrefix + String('00000' + incidentSequence).slice(-5);
    } else {
      newId = String(idPrefix + incidentSequence);
    }
    return newId;
  },

  _findUnusedId: function(incidentSequence, incidentSequenceRecord, resolve, reject) {
    incidentSequence++;
    var newId = this._createId(incidentSequence);

    this.store.find('incident', newId).then(function() {
      this._findUnusedId(incidentSequence, incidentSequenceRecord, resolve, reject);
    }.bind(this), function(err) {
      console.log('GOT ERR', err);
      if (Ember.isEmpty(incidentSequenceRecord)) {
        incidentSequenceRecord = this.store.createRecord('config', {
          id: 'incident_sequence'
        });
      }
      incidentSequenceRecord.set('value', incidentSequence);
      incidentSequenceRecord.save().then(function() {
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
          incidentSequence = 0,
          incidentSequenceRecord = configs.findBy('id', 'incident_sequence');
      this.set('idPrefix', sessionVars.prefix + '_');
      if (!Ember.isEmpty(incidentSequenceRecord)) {
        incidentSequence = incidentSequenceRecord.get('value');
      }
      this._findUnusedId(incidentSequence, incidentSequenceRecord, resolve, reject);
    }.bind(this));
  }
});