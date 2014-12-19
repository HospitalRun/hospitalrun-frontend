import Ember from "ember";
import PouchAdapterUtils from "hospitalrun/mixins/pouch-adapter-utils";

export default DS.PouchDBAdapter.extend(PouchAdapterUtils, {
    _specialQueries: [
        'containsValue',
        'fieldMapping',
        'keyValues',
        'mapReduce',
        'mapResults',
        'options.startkey',
        'options.endkey'
    ],
    
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
                        if (query.containsValue && query.containsValue.value) {
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
                                var emitKeys = Ember.ArrayPolyfills.map.call(keys, function(key) {                                        
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
                } catch (e) {
                    console.log("Got exception:",e);
                }
            }
        };
    },
    
    _handleQueryResponse: function(resolve, reject, err, response, query) {
        if (err) {
            this._pouchError(reject)(err);
        } else {
            if (response.rows) {
                var data = Ember.A(response.rows).mapBy('doc');
                if (query.mapResults) {
                    data = query.mapResults(data);
                }
                Ember.run(null, resolve, data);
            }
        }        
    },
    
    findQuery: function(store, type, query, options) {
        var specialQuery = false;
        for (var i=0;i< this._specialQueries.length; i++) {
            if (Ember.get(query,this._specialQueries[i])) {
                specialQuery = true;
                break;
            }
        }
        if (!specialQuery) {
            if (query.options) {
                var newQuery = Ember.copy(query);
                delete newQuery.options;            
                return this._super(store, type, newQuery, query.options);
            } else {
                return this._super(store, type, query, options);
            }
        } else {
            var keys = [],
                mapReduce = null,
                queryKeys = [],
                queryParams = {};
            if (query.options) {
                queryParams = Ember.copy(query.options);
            }
            queryParams.reduce  = false;
            queryParams.include_docs = true;
            if (query.keyValues) {
                for (var key in query.keyValues) {
                    if (query.keyValues.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                queryKeys = keys.map(function(key) {
                    if(key.substring(key.length - 3) === "_id" || 
                       key.substring(key.length - 4) === "_ids" || 
                       key === "id") {
                        return this._idToPouchId(query.keyValues[key], type);
                    }
                    return query.keyValues[key];
                }.bind(this));
                if(!Ember.isEmpty(queryKeys)){
                    queryParams["key"] = [].concat(queryKeys);
                }
            }
            
            if (query.mapReduce) {
                mapReduce = query.mapReduce;
            } else if (query.containsValue ||query.keyValues || query.fieldMapping) {
                mapReduce = this._createMapFunction(type, query, keys);
            }

            return new Ember.RSVP.Promise(function(resolve, reject){
                this._getDb().then(function(db){
                    try {
                        if (mapReduce) {
                            
                            db.query(mapReduce, queryParams, function(err, response) {
                                this._handleQueryResponse(resolve, reject, err, response, query);
                            }.bind(this));
                        } else {
                            db.allDocs(queryParams, function(err, response) {
                                this._handleQueryResponse(resolve, reject, err, response, query);
                            }.bind(this));
                        }
                    } catch (err){
                        this._pouchError(reject)(err);
                    }
                }.bind(this), this._pouchError(reject));
            }.bind(this), "findQuery in application-pouchdb-adapter");
        }
    }
});