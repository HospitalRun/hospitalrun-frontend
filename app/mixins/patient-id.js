import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

const { inject, isEmpty } = Ember;

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
    let config = this.get('config');
    let database = this.get('database');
    let maxValue = this.get('maxValue');

    let findUnusedId = (sequence) => {
      let current, id;
      return config.getPatientPrefix()
        .then(function(prefix) {
          current = sequence.get('value');
          id = sequenceId(prefix, current);
          let query = {
            startkey: [id, null],
            endkey: [id, maxValue]
          };
          return database.queryMainDB(query, 'patient_by_display_id');
        })
        .then(function(found) {
          if (!isEmpty(found.rows)) {
            sequence.incrementProperty('value');
            return findUnusedId(sequence);
          }
          if (sequence.get('hasDirtyAttributes')) {
            return sequence.save().then(function() {
              return id;
            });
          }
          return id;
        });
    };

    return this.store.find('sequence', 'patient')
      .then(findUnusedId)
      .catch(() => {
        let store = this.get('store');
        let sequence = store.push(store.normalize('sequence', {
          id: 'patient',
          value: 1
        }));
        return findUnusedId(sequence);
      });
  }
});

export function sequenceId(prefix, sequence) {
  if (sequence < 100000) {
    sequence = `00000${sequence}`.slice(-5);
  }
  return `${prefix}${sequence}`;
}
