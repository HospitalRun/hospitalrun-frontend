import Ember from 'ember';

const { get, inject, isEmpty } = Ember;

export default Ember.Mixin.create({
  database: inject.service(),
  sequenceName: null,
  sequenceView: null,

  /**
  * Override this function to generate an id for a new record
  * @return a generated id;default is null which means that an
  * id will be automatically generated via Ember data.
  */
  generateFriendlyId(modelName) {
    let sequenceName = get(this, 'sequenceName');
    return this.sequencePrefix().then((prefix) => {
      return this.store.find('sequence', sequenceName)
        .then((sequence) => {
          return this._findUnusedId(sequence, prefix, modelName);
        }).catch(() => {
          let store = this.get('store');
          let sequence = store.push(store.normalize('sequence', {
            id: sequenceName,
            value: 1,
            prefix
          }));
          return sequence.save().then((sequence) => {
            return this._findUnusedId(sequence, prefix, modelName);
          });
        });
    });
  },

  sequencePrefix() {
    let sequenceName = get(this, 'sequenceName');
    return this.store.find('sequence', sequenceName).then((sequence) => {
      return get(sequence, 'prefix');
    }).catch(() => {
      let type = sequenceName;
      if (type.indexOf('_') > -1) {
        type = type.substr(type.indexOf('_') + 1);
      }
      return this._findNextPrefix(type, 0);
    });
  },

  _findNextPrefix(type, prefixChars) {
    prefixChars++;
    return this._findSequenceByPrefix(type, prefixChars).then((records) => {
      if (Ember.isEmpty(records.rows)) {
        return type.toLowerCase().substr(0, prefixChars);
      } else {
        return this._findNextSequence(type, prefixChars);
      }
    }).catch(() => prefixChars);
  },

  _findSequenceByPrefix(type, prefixChars) {
    let database = this.get('database');
    let sequenceQuery = {
      key: type.toLowerCase().substr(0, prefixChars)
    };
    return database.queryMainDB(sequenceQuery, 'sequence_by_prefix');
  },

  _findUnusedId(sequence, prefix, modelName) {
    let database = get(this, 'database');
    let maxValue = database.getMaxPouchId(modelName);
    let current, id;
    let sequenceView = get(this, 'sequenceView');
    current = sequence.get('value');
    id = sequenceId(prefix, current);
    let query = {
      startkey: [id, null],
      endkey: [id, maxValue]
    };
    return database.queryMainDB(query, sequenceView).then((found) => {
      if (!isEmpty(found.rows)) {
        sequence.incrementProperty('value');
        return this._findUnusedId(sequence, prefix, modelName);
      }
      if (sequence.get('hasDirtyAttributes')) {
        return sequence.save().then(function() {
          return id;
        });
      }
      return id;
    });
  }
});

export function sequenceId(prefix, sequence) {
  if (sequence < 100000) {
    sequence = `00000${sequence}`.slice(-5);
  }
  return `${prefix}${sequence}`;
}
