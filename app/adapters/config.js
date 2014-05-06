import PouchAdapterUtils from "hospitalrun/mixins/pouch-adapter-utils";

export default DS.PouchDBAdapter.extend(PouchAdapterUtils, {
    databaseName: 'config',
    
    _mapQuery: function(doc, emit) {
        if (doc._id) {
            emit(doc._id, null);
        }
    },

    findQuery: function(store, type, query, options) {
        if (!query.exactKeys) {
            return this._super(store, type, query, options);
        } else {
            var self = this,
            keys = [],
            queryKeys = [],
            queryParams = {
                reduce: false,
                include_docs: true
            };
            
            queryParams.keys = query.exactKeys.map(function(key) {
                return self._idToPouchId(key, 'config');
            });
            return new Ember.RSVP.Promise(function(resolve, reject){
                self._getDb().then(function(db){
                    try {
                        db.query(self._mapQuery, queryParams, function(err, response) {
                            if (err) {
                                self._pouchError(reject)(err);
                            } else {
                                if (response.rows) {
                                    var data = Ember.A(response.rows).mapBy('doc');
                                    Ember.run(null, resolve, data);
                                }
                            }
                        });
                    } catch (err){
                        self._pouchError(reject)(err);
                    }
                }, self._pouchError(reject));
            }, "findQuery in config-pouchdb-adapter");
        }
    }
});