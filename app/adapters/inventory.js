export default DS.PouchDBAdapter.extend({
    namespace: 'hospitalrun-inventory',
    databaseName: 'main',

    _createMapFunction: function(type, query) {
        return function(doc, emit) {
            var found_doc = false,
                doctype, 
                uidx;
            if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
                try {
                    doctype = doc._id.substring(0, uidx);
                    if(doctype === type.typeKey) {
                        query.keys.forEach(function(key) {
                            if (doc[key] && doc[key].toLowerCase().indexOf(query.containsValue) >= 0) {
                                found_doc = true;
                            }
                        });
                        if (found_doc === true) {
                            emit(doc._id, null);
                        }
                    }
                } catch (e) {}
            }
        };
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
            mapFn = this._createMapFunction(type, query),
            queryParams = {
                reduce: false,
                include_docs: true
            };

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