import PouchAdapterUtils from "hospitalrun/mixins/pouch-adapter-utils";

export default DS.PouchDBAdapter.extend(PouchAdapterUtils, {
    databaseName: 'main',
    
    _createMapFunction: function(type, query, keys) {
        return function(doc, emit) {
            var found_doc = false,
                doctype, 
                queryValue,
                uidx;
            
            if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
                try {
                    doctype = doc._id.substring(0, uidx);
                    if(doctype === type.typeKey) {
                        if (query.containsValue) {
                            queryValue = query.containsValue.value.toLowerCase();
                            query.containsValue.keys.forEach(function(key) {
                                if (doc[key] && doc[key].toLowerCase().indexOf(queryValue) >= 0) {
                                    found_doc = true;
                                }
                            });
                        } else {
                            found_doc = true;
                        }
                        if (found_doc === true) {
                            if (query.keyValues) {
                                var emitKeys = Ember.ArrayPolyfills.map.call(keys, function(key, idx) {                                        
                                    return doc[key];
                                });
                                emit(emitKeys);
                            } else if (query.fieldMapping) {
                                emit([doc._id, 0], null);
                                var i = 0,
                                    field;
                                for (field in query.fieldMapping) {
                                    if (doc[field]) {
                                        emit([doc._id, ++i], {
                                            _id: query.fieldMapping[field]+'_'+doc[field]
                                        });
                                    }
                                }                                
                            } else {
                                emit(doc._id, null);
                            }
                        }
                    }
                } catch (e) {}
            }
        };
    },    

    findQuery: function(store, type, query, options) {
        if (!query.mapReduce && !query.containsValue && !query.keyValues && !query.mapResults && !query.fieldMapping) {
            return this._super(store, type, query, options);
        } else {
            var self = this,
                keys = [],
                mapReduce = null,
                queryKeys = [],
                queryParams = {
                    reduce: false,
                    include_docs: true
                };
        
            if (query.keyValues) {
                for (var key in query.keyValues) {
                    if (query.keyValues.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                queryKeys = Ember.ArrayPolyfills.map.call(keys, function(key) {
                    if(key.substring(key.length - 3) === "_id" || 
                       key.substring(key.length - 4) === "_ids" || 
                       key === "id") {
                        return this._idToPouchId(query.keyValues[key], type);
                    }
                    return query.keyValues[key];
                });
                if(!Ember.isEmpty(queryKeys)){
                    queryParams["key"] = [].concat(queryKeys);
                }
            }
            
            if (query.mapReduce) {
                mapReduce = query.mapReduce;
            } else {
                mapReduce = this._createMapFunction(type, query, keys);
            }

            return new Ember.RSVP.Promise(function(resolve, reject){
                self._getDb().then(function(db){
                    try {
                        db.query(mapReduce, queryParams, function(err, response) {
                            if (err) {
                                self._pouchError(reject)(err);
                            } else {
                                if (response.rows) {
                                    var data = Ember.A(response.rows).mapBy('doc');
                                    if (query.mapResults) {
                                        data = query.mapResults(data);
                                    }
                                    Ember.run(null, resolve, data);
                                }
                            }
                        });
                    } catch (err){
                        self._pouchError(reject)(err);
                    }
                }, self._pouchError(reject));
            }, "findQuery in application-pouchdb-adapter");
        }
    }
});