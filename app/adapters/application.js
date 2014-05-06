import PouchAdapterUtils from "hospitalrun/mixins/pouch-adapter-utils";

export default DS.PouchDBAdapter.extend(PouchAdapterUtils, {
    databaseName: 'main',

     findQuery: function(store, type, query, options) {
        if (!query.viewName) {
            return this._super(store, type, query, options);
        } else {
            var self = this,
            keys = [],
            queryKeys = [],
            queryParams = {
                reduce: false,
                include_docs: true
            };
            return new Ember.RSVP.Promise(function(resolve, reject){
                self._getDb().then(function(db){
                    try {
                        db.query(query.viewName, queryParams, function(err, response) {
                            if (err) {
                                self._pouchError(reject)(err);
                            } else {
                                if (response.rows) {
                                    var data = Ember.A(response.rows).mapBy('doc');
                                    console.log("data:",data);
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