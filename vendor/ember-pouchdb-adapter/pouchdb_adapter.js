(function() {
  var get = Ember.get, set = Ember.set;

  DS.PouchDBSerializer = DS.JSONSerializer.extend({
    primaryKey: '_id',
    
      /**
       Given a subclass of `DS.Model` and a JSON object this method will
       iterate through each attribute of the `DS.Model` and invoke the
       `DS.Transform#deserialize` method on the matching property of the
       JSON object.  This method is typically called after the
       serializer's `normalize` method.

       @method applyTransforms
       @private
       @param {subclass of DS.Model} type
       @param {Object} data The data to transform
       @return {Object} data The transformed data object
      */
      applyTransforms: function(type, data) {
        return data;
      },
    
    normalize: function(type, hash) {
      this._super.apply(this, arguments);
      if (hash.length) {
        for(var i=0;i<hash.length;i++) {
            if (hash[i]._id) {
              hash[i].id = hash[i]._id;
            }
        }
      } else {
        if (hash._id) {
          hash.id = hash._id;
        }
      }
      return hash;
    }
  });

  /**
   * Based on https://github.com/panayi/ember-data-indexeddb-adapter and https://github.com/wycats/indexeddb-experiment
   *
   */
  DS.PouchDBAdapter = DS.Adapter.extend({
    defaultSerializer: 'pouchdb',

    /**
     Hook used by the store to generate client-side IDs. This simplifies
     the timing of committed related records, so it's preferable.

     For this adapter, we use uuid.js by Rober Kieffer, which generates
     UUIDs using the best-available random number generator.

     @returns {String} a UUID
     */
    generateIdForRecord: function() {
      return uuid();
    },

    /**
     Main hook for saving a newly created record.

     @param {DS.Store} store
     @param {Class} type
     @param {DS.Model} records
     */
    createRecord: function(store, type, record) {
      var db = this._getDb(),
          hash = this.serialize(record, { includeId: true, includeType: true });
      // Store the type in the value so that we can index it on read
      hash['emberDataType'] = type.toString();
      return new Ember.RSVP.Promise(function(resolve, reject) {
        db.put(hash, function(err, response) {
          if (!err) {
            set(record, 'data._rev', response.rev);
            resolve(record);
          } else {
            reject(err);
          }
        });
      });
    },

    /**
     Main hook for updating an existing record.

     @param {DS.Store} store
     @param {Class} type
     @param {DS.Model} record
     */
    updateRecord: function(store, type, record) {
      var db = this._getDb(),
          hash = this.serialize(record, { includeId: true, includeType: true });
      // Store the type in the value so that we can index it on read
      hash['emberDataType'] = type.toString();
      return new Ember.RSVP.Promise(function(resolve, reject) {
        db.put(hash, function(err, response) {
          if (err) {
            reject(err);
          } else {
            resolve({id: response.id, _rev: response.rev});
          }
        });
      });
    },

    deleteRecord: function(store, type, record) {
      var db = this._getDb();
      return new Ember.RSVP.Promise(function(resolve, reject) {
        db.remove({
          _id: get(record, 'id'),
          _rev: get(record, 'data._rev')
        }, function(err, response) {
          if (err) {
            reject(err);
          } else {
            resolve({id: response.id, _rev: response.rev});
          }
        });
      });
    },

    find: function(store, type, id) {
      var db = this._getDb();
      return new Ember.RSVP.Promise(function(resolve, reject) {
        db.get(id, function(err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      });
    },

    findMany: function(store, type, ids) {
      var db = this._getDb(),
          data = [];
      return new Ember.RSVP.Promise(function(resolve, reject) {
        db.allDocs({keys: ids, include_docs: true}, function(err, response) {
          if (err) {
            reject(err);
          } else {
            if (response.rows) {
              response.rows.forEach(function(row) {
                if (!row.error) {
                  data.push(row.doc);
                }
              });
              resolve(data);
            }
          }
        });
      });
    },

    findAll: function(store, type, sinceToken) {
      var db = this._getDb(),
          data = [];
      return new Ember.RSVP.Promise(function(resolve, reject) {
        db.query({map: function(doc) {
          if (doc['emberDataType']) {
            emit(doc['emberDataType'], null);
          }
        }}, {reduce: false, key: type.toString(), include_docs: true}, function(err, response) {
          if (err) {
            reject(err);
          } else {
            if (response.rows) {
              response.rows.forEach(function(row) {
                data.push(row.doc);
              });
              resolve(data);
            }
          }
        });
      });
    },

    findQuery: function(store, type, query, array) {
      var db = this._getDb();
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var keys = [];
        for (key in query) {
          if (query.hasOwnProperty(key)) {
            keys.push(key);
          }
        }

        var emitKeys = keys.map(function(key) {
          return 'doc.' + key;
        });
        var queryKeys = keys.map(function(key) {
          return query[key];
        });

        // Very simple map function for a conjunction (AND) of all keys in the query
        var mapFn = 'function(doc) {' +
              'if (doc["emberDataType"]) {' +
                'emit([doc["emberDataType"]' + (emitKeys.length > 0 ? ',' : '') + emitKeys.join(',') + '], null);' +
              '}' +
            '}',
            options = {
              reduce: false,
              key: [].concat(type.toString(), queryKeys),
              include_docs: true
            };

        db.query({map: mapFn}, options, function(err, response) {
          if (err) {
            reject(err);
          } else {
            var data = response.rows 
                ? response.rows.map(function(row) { return row.doc; }) 
                : [];
            resolve(data);
          }
        });
      });
    },

    // private

    /**
     * Lazily create a PouchDB instance
     *
     * @returns {PouchDB}
     * @private
     */
    _getDb: function() {
      if (!this.db) {
        this.db = new PouchDB(this.databaseName || 'ember-application-db');
      }
      return this.db;
    }

  });

  Ember.onLoad('Ember.Application', function(Application) {
    Application.initializer({
      name: 'pouchdb',
      initialize: function(container, application) {
        application.register('serializer:pouchdb', DS.PouchDBSerializer);
        application.register('adapter:pouchdb', DS.PouchDBAdapter);
      }
    });
  });

})();
