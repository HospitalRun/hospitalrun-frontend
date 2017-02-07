import Ember from 'ember';
export default Ember.Mixin.create({
  idPrefix: null,

  _createId(incidentSequence) {
    let idPrefix = this.get('idPrefix');
    let newId;
    if (incidentSequence < 100000) {
      newId = idPrefix + String(`00000${incidentSequence}`).slice(-5);
    } else {
      newId = String(idPrefix + incidentSequence);
    }
    return newId;
  },

  _findUnusedId(incidentSequence, incidentSequenceRecord, resolve, reject) {
    incidentSequence++;
    let newId = this._createId(incidentSequence);

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
  generateId() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let configs = this.modelFor('application');
      let sessionVars = this.get('session').store.restore();
      let incidentSequence = 0;
      let incidentSequenceRecord = configs.findBy('id', 'incident_sequence');
      this.set(`idPrefix${sessionVars.prefix}_`);
      if (!Ember.isEmpty(incidentSequenceRecord)) {
        incidentSequence = incidentSequenceRecord.get('value');
      }
      this._findUnusedId(incidentSequence, incidentSequenceRecord, resolve, reject);
    }.bind(this));
  }
});
