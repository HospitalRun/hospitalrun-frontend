export default DS.PouchDBAdapter.extend({
    namespace: 'hospitalrun-inventory',
    databaseName: 'main',

    _createMapFunction: function(type, query) {
        return function(doc, emit) {
            var emitKeys = query.keys.map(function(key) {
                return doc[key];
            });

            var found_doc = false;
            if (doc["emberDataType"] && doc["emberDataType"] === type.typeKey) {
                query.keys.forEach(function(key) {
                    if (doc[key] && doc[key].toLowerCase().indexOf(query.containsValue) >= 0) {
                        found_doc = true;
                    }
                });
                if (found_doc === true) {
                    emit(doc["emberDataType"], null);
                }
            }
        };
    },

    findQuery: function(store, type, query, array) {
        var db = this._getDb();
        var mapFn = this._createMapFunction(type, query);
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var options = {
                reduce: false,
                include_docs: true
            };
            db.query({map: mapFn}, options, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    var data = response.rows ? response.rows.map(function(row) { return row.doc; }) : [];
                    resolve(data);
                }
            });
        });
    }
});