export default DS.PouchDBAdapter.extend({
    namespace: 'hospitalrun-inventory',
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
                        queryValue = query.containsValue.value.toLowerCase();
                        query.containsValue.keys.forEach(function(key) {
                            if (doc[key] && doc[key].toLowerCase().indexOf(queryValue) >= 0) {
                                found_doc = true;
                            }
                        });
                        if (found_doc === true) {
                            if (query.keyValues) {
                                var emitKeys = Ember.ArrayPolyfills.map.call(keys, function(key, idx) {                                        
                                    return doc[key];
                                });
                                emit(emitKeys);
                            } else {
                                emit(doc._id, null);
                            }
                        }
                    }
                } catch (e) {}
            }
        };
    },
    
    _idToPouchId: function(id, type){
        type = type.typeKey || type;
        return [type, id].join("_");
    },

    _pouchError: function(reject){
        return function(err){
            var errmsg = [  err["status"], 
                (err["name"] || err["error"])+":",
                (err["message"] || err["reason"])
               ].join(" ");
            Ember.run(null, reject, errmsg);
        };
    },        

    findQuery: function(store, type, query, options) {
        var self = this,
            keys = [],
            mapFn = null,
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
        }
        
        if(!Ember.isEmpty(queryKeys)){
            queryParams["key"] = [].concat(queryKeys);
        }
        mapFn = this._createMapFunction(type, query, keys);

        return new Ember.RSVP.Promise(function(resolve, reject){
            self._getDb().then(function(db){
                try {
                    db.query({map: mapFn}, queryParams, function(err, response) {
                        if (err) {
                            self._pouchError(reject)(err);
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
                    self._pouchError(reject)(err);
                }
            }, self._pouchError(reject));
        }, "findQuery in inventory-pouchdb-adapter");
    }
});