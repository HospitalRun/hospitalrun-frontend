/*************************************************************************************
  Copyright (c) 2014 Paul Koch <my.shando@gmail.com>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
  copies of the Software, and to permit persons to whom the Software is 
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
  THE SOFTWARE.

  Ember PouchDB Adapter 
  Author: kulpae <my.shando@gmail.com> 

*************************************************************************************/
(function() {
  var get = Ember.get, set = Ember.set;
  var map = Ember.ArrayPolyfills.map;
  var forEach = Ember.ArrayPolyfills.forEach;

  function idToPouchId(id, type){
    type = type.typeKey || type;
    return [type, id].join("_");
  }

  function pouchIdToIdType(id){
    var idx = id.indexOf("_");
    return (idx === -1)? [id, null] : [id.substring(idx+1), id.substring(0, idx)];
  }

  function pouchIdToId(id){
    return pouchIdToIdType(id)[0];
  }

  DS.PouchDBSerializer = DS.JSONSerializer.extend({
    primaryKey: '_id',

    typeForRoot: function(root) {
      var camelized = Ember.String.camelize(root);
      return Ember.String.singularize(camelized);
    },

    /**
     * Override to get the document revision that is stored on the record for PouchDB updates
     */
    serialize: function(record, options) {
      var json = this._super(record, options);
      json._rev = get(record, 'data._rev');
      //append the type to _id, so that querying by type can utilize the order
      json[get(this, 'primaryKey')] = idToPouchId(get(record, 'id'), record.constructor);
      return json;
    },

    serializeHasMany: function(record, json, relationship){
      this._super(record, json, relationship);

      var key = relationship.key;
      json[key] = get(record, key).map(function(relItem){
        return idToPouchId(relItem.get('id'), relItem.constructor || relItem.type || relationship.type);
      }).concat([]);
    },

    serializeBelongsTo: function(record, json, relationship) {
      this._super(record, json, relationship);
      var key = relationship.key;
      var type = relationship.type;
      if(json[key]) json[key] = idToPouchId(json[key], type);
    },

    normalize: function(type, hash) {
      if(Ember.isEmpty(hash)) return hash;
      hash.id = hash.id || hash._id;
      if(hash.id){
        hash.id = pouchIdToId(hash.id);
      }
      delete hash._id;

      return this._super(type, hash);
    },

    extractSingle: function(store, type, payload, id) {
      payload = this.normalize(type, payload);
      type.eachRelationship(function(accessor, relationship){
        if(relationship.kind == "hasMany" && payload[accessor]){
          var items = Ember.makeArray(payload[accessor]);
          if(relationship.options.polymorphic){
            items = map.call(items, function(i){
              var idtype = pouchIdToIdType(i);
              return {id: idtype[0], type: idtype[1]};
            });
          } else {
            items = map.call(items, function(i){
              var id = pouchIdToId(i);
              return id;
            });
          }
          payload[accessor] = Ember.A(items);
        }else if(relationship.kind == "belongsTo" && payload[accessor]){
          var item = payload[accessor];
          if(relationship.options.polymorphic){
            var idtype = pouchIdToIdType(item);
            item = {id: idtype[0], type: idtype[1]};
          } else {
            item = pouchIdToId(item);

          }
          payload[accessor] = item;
        }
      });

      if(payload['_embedded']){
        var sideload = payload._embedded;
        delete payload._embedded;
        for(var prop in sideload){
          if(!sideload.hasOwnProperty(prop)) next;
          var typeName = this.typeForRoot(prop),
              type = store.modelFor(typeName),
              typeSerializer = store.serializerFor(type);

          forEach.call(sideload[prop], function(hash){
            hash = typeSerializer.extractSingle(store, type, hash);
            store.push(typeName, hash);
          });
        }
      }
      return payload;
    },

    extractArray: function(store, type, payload){
      var array =  map.call(payload, function(hash){
        return this.extractSingle(store, type, hash);
      }, this);

      return array;
    }
  });

  function _pouchError(reject){
    return function(err){
      var errmsg = [  err["status"], 
                     (err["name"] || err["error"])+":",
                     (err["message"] || err["reason"])
                   ].join(" ");
      Ember.run(null, reject, errmsg);
    }
  }

  /**
   * Initially based on https://github.com/panayi/ember-data-indexeddb-adapter and https://github.com/wycats/indexeddb-experiment
   * then based on https://github.com/chlu/ember-pouchdb-adapter
   */
  DS.PouchDBAdapter = DS.Adapter.extend({
    defaultSerializer: "_pouchdb",
    MAX_DOC_LIMIT: 500,


    /**
     Hook used by the store to generate client-side IDs. This simplifies
     the timing of committed related records, so it's preferable.

     @returns {String} a UUID
     */
    generateIdForRecord: function() {
      return PouchDB.utils.uuid();
    },

    /**
     Main hook for saving a newly created record.

     @param {DS.Store} store
     @param {Class} type
     @param {DS.Model} records
     */
    createRecord: function(store, type, record) {
      var self = this,
          id = get(record, 'id'),
          hash = self.serialize(record, { includeId: true });

      //having _rev would make an update and produce a missing revision
      delete hash._rev;

      return new Ember.RSVP.Promise(function(resolve, reject){
        self._getDb().then(function(db){
          try{
            db.put(hash, function(err, response) {
              if (!err) {
                hash = Ember.copy(hash, true);
                hash._rev = response.rev;
                Ember.run(null, resolve, hash);
              } else {
                _pouchError(reject)(err);
              }
            });
          } catch (err){
            _pouchError(reject)(err);
          }
        }, _pouchError(reject));
      }, 'createRecord in ember-pouchdb-adapter');
    },

    /**
     Main hook for updating an existing record.

     @param {DS.Store} store
     @param {Class} type
     @param {DS.Model} record
     */
    updateRecord: function(store, type, record) {
      var self = this,
          id = get(record, 'id'),
          hash = this.serialize(record, { includeId: true });

      return new Ember.RSVP.Promise(function(resolve, reject){
        self._getDb().then(function(db){
          try {
            db.get(hash['_id'], function(getErr, oldHash){
              try {
                db.put(hash, function(err, response) {
                  if (!err) {
                    hash = Ember.copy(hash);
                    hash._rev = response.rev;
                    Ember.run.begin();
                    if(oldHash){
                      self._updateRelationships(id, type, oldHash, hash).then(function(){
                        Ember.run(null, resolve, hash);
                      });
                    } else {
                      Ember.run(null, resolve, hash);
                    }
                    Ember.run.end();
                  } else {
                    _pouchError(reject)(err);
                  }
                });
              } catch (err){
                _pouchError(reject)(err);
              }
            });
          } catch (err){
            _pouchError(reject)(err);
          }
        }, _pouchError(reject));
      }, "updateRecord in ember-pouchdb-adapter");
    },

    deleteRecord: function(store, type, record) {
      var self = this,
          id = record.get('id'),
          hash = this.serialize(record, { includeId: true });
      
      return new Ember.RSVP.Promise(function(resolve, reject){
        self._getDb().then(function(db){
          try {
            db.get(hash['_id'], function(getErr, oldHash){
              try {
                db.remove(hash, function(err, response) {
                  if (err) {
                    _pouchError(reject)(err);
                  } else {
                    hash = Ember.copy(hash);
                    hash._rev = response.rev;
                    Ember.run.begin();
                    self._updateRelationships(id, type, oldHash, {}).then(function(){
                      Ember.run(null, resolve);
                    });
                    Ember.run.end();
                  }
                });
              } catch (err){
                _pouchError(reject)(err);
              }
            });
          } catch (err){
            _pouchError(reject)(err);
          }
        }, _pouchError(reject));
      }, "deleteRecord in ember-pouchdb-adapter");
    },

    find: function(store, type, id) {
      return this.findMany(store, type, [id]).then(function(data){
        return data[0] || {};
      });
    },

    findMany: function(store, type, ids, options) {
      var self = this,
          data = Ember.A();

      if(!options) options = {};
      if(Ember.typeOf(options) != 'object') options = {param: options};
      if(Ember.isNone(options.embed)) options.embed = true;

      ids = map.call(ids, function(id){
        return idToPouchId(id, type);
      });

      return new Ember.RSVP.Promise(function(resolve, reject){
        self._getDb().then(function(db){
          var promises = [];
          forEach.call(ids, function(id){
            var deferred = Ember.RSVP.defer();
            promises.push(deferred.promise);
            try {
              db.get(id, function(err, response){
                if(err){
                  Ember.run(null, deferred.reject, err);
                } else {
                  Ember.run(null, deferred.resolve, response);
                }
              });
            } catch (err){
              Ember.run(null, deferred.reject, err);
            }
          });

          Ember.RSVP.all(promises).then(function(docs){
            forEach.call(docs, function(doc){
              if (doc && !doc["error"]){
                data.push(doc);
              }
            });
            Ember.run.begin();
            self._resolveRelationships(store, type, data, options).then(function(data){
              Ember.run(null, resolve, data);
            });
            Ember.run.end();
          }, _pouchError(reject));
        }, _pouchError(reject));
      }, "findMany in ember-pouchdb-adapter");
    },

    findAll: function(store, type, options) {
      var self = this,
          start = type.typeKey,
          end = start + '~~',
          data = Ember.A(),
          queryParams = {},
          limit = Number.MAX_VALUE,
          skip = 0,
          totalRows = 0,
          MAX_DOC_LIMIT = self.get("MAX_DOC_LIMIT");

      if(!options) options = {};
      if(Ember.typeOf(options) != 'object') options = {since: options};
      if(Ember.isNone(options.embed)) options.embed = true;

      queryParams['include_docs'] = true;
      queryParams['startkey'] = start;
      queryParams['endkey'] = end;
      if(options.limit){
        limit = options.limit;
      }
      if(options.skip){
        skip = options.skip;
        queryParams['skip'] = skip;
      }


      return new Ember.RSVP.Promise(function(resolve, reject){
        self._getDb().then(function(db){
          try {
            var deferred = Ember.RSVP.resolve(false);
            var finishDefer = Ember.RSVP.defer();

            var responseFunc = function(response){
              var nextDeferred = Ember.RSVP.defer();
              var stepLimit;
              if(limit >= 0){
                stepLimit = Math.min(limit, MAX_DOC_LIMIT);
              } else {
                stepLimit = MAX_DOC_LIMIT;
              }
              queryParams['limit'] = stepLimit;

              if (response && response.rows) {
                forEach.call(response.rows, function(row) {
                  if(!row["error"]){
                    data.push(row.doc);
                  } else {
                    console.log('cannot find', row.key +":", row.error);
                  }
                });
              }
              
              //on first call and then as long as data looks to be cut by limit
              if(!response || (response && response.rows.length >= stepLimit) && limit > 0){
                db.allDocs(queryParams, function(err, data){
                  if(data && data.rows && data.rows.length > 0){
                    queryParams['skip'] = 1;
                    queryParams['startkey'] = data.rows[data.rows.length - 1].key;
                  }
                  limit -= stepLimit;
                  if(err) {
                    Ember.run(nextDeferred, "reject", err);
                  } else {
                    Ember.run(nextDeferred, "resolve", data);
                  }
                });
                nextDeferred.promise.then(responseFunc, _pouchError(reject));
              } else {
                finishDefer.resolve(data);
              }
            };
            deferred.then(responseFunc);
            
            finishDefer.promise.then(function(response){
              Ember.run(function(){
                self._resolveRelationships(store, type, data, options).then(function(data){
                  Ember.run(null, resolve, data);
                });
              });
            });
          } catch (err){
            _pouchError(reject)(err);
          }
        }, _pouchError(reject));
      }, "findAll in ember-pouchdb-adapter");
    },

    findQuery: function(store, type, query, options) {
      var self = this,
          queryParams = {},
          queryFunc = null,
          metaKeys = {_limit: 'limit', _skip: 'skip'},
          metaAllKeys = ['_limit', '_skip'],
          keys = [],
          useFindAll = true,
          view = null;

      if(!options) options = {};
      if(Ember.isArray(options)) options = {array: options};
      if(Ember.typeOf(options) != 'object') options = {param: options};
      if(Ember.isNone(options.embed)) options.embed = true;

      // select direct attributes only
      for (var key in query) {
        if (query.hasOwnProperty(key)) {
          if(typeof metaKeys[key] !== 'undefined'){
            queryParams[metaKeys[key]] = query[key];
            if(!metaAllKeys.contains(key)){
              useFindAll = false;
            } else {
              options[metaKeys[key]] = query[key];
            }
          } else if(key == "_view"){
            view = query[key];
            useFindAll = false;
          } else {
            keys.push(key);
            useFindAll = false;
          }
        }
      }
      
      // if query is empty use findAll, which is faster
      if(useFindAll) return self.findAll(store, type, options);

      var emitKeys = map.call(keys, function(key, idx) {
        if(key === "id") key = "_id";
        return 'doc.' + key;
      });
      var queryKeys = map.call(keys, function(key) {
        if(key.substring(key.length - 3) === "_id" || 
           key.substring(key.length - 4) === "_ids" || 
           key === "id") {
          return idToPouchId(query[key], type);
        }
        return query[key];
      });

      // Very simple map function for a conjunction (AND) of all keys in the query
      var mapFn = 'function(doc) {' +
            'var uidx, type;' +
            'if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {' +
            '  try {'+
            '    type = doc._id.substring(0, uidx);' +
            '    if(type == "'+type.typeKey+'")' +
            '    emit([' + emitKeys.join(',') + '], null);' +
            '  } catch (e) {}' +
            '}' +
          '}';

      if(!Ember.isEmpty(queryKeys)){
        queryParams["key"] = [].concat(queryKeys);
      }
      queryParams["include_docs"] = true;
      queryParams["reduce"] = false;

      if(Ember.isEmpty(view)){
        queryFunc = {map: mapFn};
      } else {
        queryFunc = view;
      }

      return new Ember.RSVP.Promise(function(resolve, reject){
        self._getDb().then(function(db){
          try {
            db.query(queryFunc, queryParams, function(err, response) {
              if (err) {
                _pouchError(reject)(err);
              } else {
                if (response.rows) {
                  var data = Ember.A(response.rows).mapBy('doc');
                  Ember.run(function(){
                    self._resolveRelationships(store, type, data, options).then(function(data){
                      Ember.run(null, resolve, data);
                    });
                  });
                }
              }
            });
          } catch (err){
            _pouchError(reject)(err);
          }
        }, _pouchError(reject));
      }, "findQuery in ember-pouchdb-adapter");
    },

    // private

    /**
     * Fetch hasMany relationship ids and assign them to data.
     * @param {DS.Store} store
     * @param {Class} type object type
     * @param {Array} items collection of non-normalized objects
     * @param {Function} completeFunc called when operation is done
     * @private
     */
    _resolveRelationships: function(store, type, items, options){
      if(options && options.embed !== true){
        return Ember.RSVP.resolve(items);
      }

      // items = Ember.copy(items, true);
      var serializer = store.serializerFor(type);
      var promises = Ember.A();
      var self = this;

      function embedSideload(store, type, ids, mainItem){
        return self.findMany(store, type, ids, {embed: false}).then(function(relations){
          if(!Ember.isEmpty(relations)){
            if(!mainItem['_embedded']) mainItem['_embedded'] = {};
            mainItem['_embedded'][type] = Ember.makeArray(relations);
          }
        });
      }

      forEach.call(items, function(item){
        //extract the id
        var itemId = serializer.normalize(type, {_id: item._id}).id;
        type.eachRelationship(function(key, relationship){
          var isSync = Ember.isNone(relationship.options.async);
          if(isSync && !Ember.isEmpty(get(item, key))){
            var itemKeys = Ember.makeArray(get(item, key));
            // divide ids in typed arrays 
            // (in case of polymorphism many types are possible)
            var typedItemsKeys = {};
            forEach.call(itemKeys, function(i){
              var idtype = pouchIdToIdType(i);
              if(!typedItemsKeys[idtype[1]]) typedItemsKeys[idtype[1]] = [];
              typedItemsKeys[idtype[1]].push(idtype[0]);
            });
            for(var relType in typedItemsKeys){
              if(!typedItemsKeys.hasOwnProperty(relType)) continue;
              var relIds = typedItemsKeys[relType];
              promises.push(embedSideload(store, relType, relIds, item));
            }
          }
        });
      });

      return Ember.RSVP.allSettled(promises, '_resolveRelationships in ember-pouchdb-adapter').then(function(results){
        return items;
      });
    },

    _updateRelationships: function(recordId, recordType, oldHash, newHash){
      var promises = [];
      var self = this;

      function updateBelongsTo(recId, recType, key, newVal, oldVal){
        if(newVal === oldVal) return null;

        var deferred = Ember.RSVP.defer();
        self._getDb().then(function(db){
          try {
            db.get(recId, function(err, data){
              if(err || !data){
                Ember.run(this, deferred.resolve);
              } else {
                var other = data;
                if(other[key] === oldVal && other[key] !== newVal){
                  other[key] = newVal;
                  try {
                    db.put(other, function(err, res){
                      if(err){
                        Ember.run(this, deferred.reject, err);
                      } else {
                        Ember.run(this, deferred.resolve);
                      }
                    });
                  } catch (err){
                    Ember.run(this, deferred.reject, err);
                  }
                } else {
                  Ember.run(this, deferred.resolve);
                }
              }
            });
          } catch (err){
            Ember.run(this, deferred.reject, err);
          }
        }, function(err){
          Ember.run(this, deferred.reject, err);
        });
        return deferred.promise;
      };

      function updateHasMany(recId, recType, key, newVal, oldVal){
        if(newVal === oldVal || !(oldVal || newVal)) return null;

        var deferred = Ember.RSVP.defer();
        self._getDb().then(function(db){
          try {
            db.get(recId, function(err, data){
              if(err || !data){
                Ember.run(this, deferred.resolve);
              } else {
                var other = data;
                if(other[key].indexOf && 
                   (oldVal && other[key].indexOf(oldVal) >= 0) ||
                   (newVal && other[key].indexOf(newVal) == -1)){
                  if(oldVal) {
                    var index = other[key].indexOf(oldVal);
                    delete other[key][index];
                  }
                  if(newVal) {
                    other[key].push(newVal);
                  }
                  try {
                    db.put(other, function(err, res){
                      if(err){
                        Ember.run(this, deferred.reject, err);
                      } else {
                        Ember.run(this, deferred.resolve);
                      }
                    });
                  } catch (err){
                    Ember.run(this, deferred.reject, err);
                  }
                } else {
                  Ember.run(this, deferred.resolve);
                }
              }
            });
          } catch (err){
            Ember.run(this, deferred.reject, err);
          }
        }, function(err){
          Ember.run(this, deferred.reject, err);
        });
        return deferred.promise;
      };

      recordType.eachRelationship(function(key, rel){
        var inverse = recordType.inverseFor(key);
        var otherKey, otherKind;
        var otherType = rel.type;
        var recordData;
        var updateMethod;
        // for oneToNone or manyToNone there is nothing to do
        if(inverse){
          otherKey = inverse.name;
          otherKind = inverse.kind;
          //works the same for records belongsTo and hasMany relationships
          //differentiates between others relationship kind only

          if(otherKind === "belongsTo"){
            updateMethod = updateBelongsTo;
          } else {
            updateMethod = updateHasMany;
          }
          var othersOld = Ember.makeArray(oldHash && oldHash[key]);
          var othersNew = Ember.makeArray(newHash && newHash[key]);
          var idsWithRemovedRel = Ember.A(othersOld).reject(function(id){
            return othersNew.indexOf(id) >= 0;
          });
          var idsWithAddedRel = Ember.A(othersNew).reject(function(id){
            return othersOld.indexOf(id) >= 0;
          });
          //remove old unlinked relationship(s)
          forEach.call(idsWithRemovedRel, function(o){
            var recPouchId = idToPouchId(recordId, recordType);
            promises.push(updateMethod(o, otherType, otherKey, null, recPouchId));
          });
          //add new linked relationship(s)
          forEach.call(idsWithAddedRel, function(o){
            var recPouchId = idToPouchId(recordId, recordType);
            promises.push(updateMethod(o, otherType, otherKey, recPouchId, null));
          });
        }
      });

      return Ember.RSVP.all(promises, "_updateRelationships in ember-pouchdb-adapter");
    },

    /* Close the pouchdb database, when destroyed
     */
    destroy: function(){
      if(this.db) {
        Ember.RSVP.Promise.cast(this.db, 'PouchDB availability').then(function(db){
          db.close();
        });
      }
      this._super();
    },

    /**
     * Lazily create a PouchDB instance
     *
     * @returns Promise that resolves to {PouchDB}
     * @private
     */
    _getDb: function() {
      var self = this;
      if(self.db && self.db.then) return self.db;

      var promise = new Ember.RSVP.Promise(function(resolve, reject){
        if (!self.db) {
          new PouchDB(self.databaseName || 'ember-application-db', function(err, db){
            if(err){
              Ember.run(null, reject, err);
            } else {
              self.db = db;
              Ember.run(null, resolve, db);
            }
          });
        } else {
          Ember.run(null, resolve, self.db);
        }
      }, 'PouchDB availability');
      
      if (!self.db) {
        self.db = promise;
      }
      return promise;
    }
  });

})();


/**
 * Registers PouchDB adapter and serializer to emberjs.
 */
(function() {
Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "PouchDBAdapter",

    initialize: function(container, application) {
      application.register('serializer:_pouchdb', DS.PouchDBSerializer);
      application.register('adapter:_pouchdb', DS.PouchDBAdapter);
    }
  });
});

})();
