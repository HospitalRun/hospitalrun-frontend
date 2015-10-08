import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

const {inject, isEmpty} = Ember;

export default Ember.Mixin.create(PouchDbMixin, {
  idPrefix: null,
  database: inject.service(),
  config: inject.service(),

  /**
  * Override this function to generate an id for a new record
  * @return a generated id;default is null which means that an
  * id will be automatically generated via Ember data.
  */
  generateFriendlyId() {
    const config = this.get('config');
    const database = this.get('database');
    const maxValue = this.get('maxValue');

    const findUnusedId = (sequence) => {
      let next, id;
      return config.getPatientPrefix()
        .then(function (prefix) {
          next = sequence.incrementProperty('value');
          id = sequenceId(prefix, next);
          const query = {
            startkey: [ id, null ],
            endkey: [ id, maxValue ],
          };
          return database.queryMainDB(query, 'patient_by_display_id');
        })
        .then(function (found) {
          if (isEmpty(found.rows)) {
            sequence.set('value', next);
          } else {
            return findUnusedId(sequence);
          }
          return sequence.save().then(function () {
            return id;
          });
        });
    };

    return this.store.find('sequence', 'patient')
      .then(findUnusedId)
      .catch(() => {
        var sequence = this.get('store').push('sequence', {
          id: 'patient',
          value: 0
        });
        return findUnusedId(sequence);
      });
  }
});

export function sequenceId (prefix, sequence) {
  if (sequence < 100000) {
    sequence = `00000${sequence}`.slice(-5);
  }
  return `${prefix}${sequence}`;
}
