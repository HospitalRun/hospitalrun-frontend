import Ember from "ember";
import PouchDb from "hospitalrun/mixins/pouchdb";
import PouchAdapterUtils from "hospitalrun/mixins/pouch-adapter-utils";

export default DS.PouchDBAdapter.extend(PouchDb, PouchAdapterUtils, {
    _specialQueries: [
        'containsValue',
        'mapReduce',
        'options.startkey',
        'options.endkey',
        'searchIndex'
    ],
  
    _executeContainsSearch: function(store, type, query, options) {
         return new Ember.RSVP.Promise(function(resolve, reject){
            var searchUrl = '/search/hrdb/'+type.typeKey+'/_search';
            if (query.containsValue && query.containsValue.value) {
                var queryString = '';
                query.containsValue.keys.forEach(function(key) {
                    if (!Ember.isEmpty(queryString)) {
                        queryString += ' OR ';
                    }
                    queryString += key+':'+query.containsValue.value;
                });
                Ember.$.ajax(searchUrl, {
                    dataType: 'json',
                    data: {
                        q:queryString
                    },
                    success: function (results) {
                        if (results && results.hits && results.hits.hits) {
                            var resultDocs = Ember.A(results.hits.hits).map(function(hit) {
                                return {
                                    doc: hit._source
                                };
                            });
                            var response = {
                                rows: resultDocs
                            };
                            this._handleQueryResponse(resolve, response, store, type, options);
                        } else if (results.rows) {
                            this._handleQueryResponse(resolve, results, store, type, options);
                        } else {
                            reject('Search results are not valid');
                        }
                    }.bind(this)
                });
            } else {
                reject('invalid query');
            }
        }.bind(this));
    },
    
    _handleQueryResponse: function(resolve, response, store, type, options) {
        if (response.rows) {
            var data = Ember.A(response.rows).mapBy('doc');
            if(Ember.isNone(options.embed)) {
                options.embed = true;
            }
            this._resolveRelationships(store, type, data, options).then(function(data){
                resolve(data);
            }.bind(this));
        }
    },
    
    /**
     * Look for nulls and maxvalues in start key because those keys can't be handled by the sort/list function
     */
    _doesStartKeyContainSpecialCharacters: function(startkey) {
        var haveSpecialCharacters = false,
            maxValue = this.get('maxValue');
        if (!Ember.isEmpty(startkey) && Ember.isArray(startkey)) {
            startkey.forEach(function(keyvalue) {
                if (keyvalue === null || keyvalue === maxValue) {
                    haveSpecialCharacters = true;
                }
            });
        }
        return haveSpecialCharacters;
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
            var mapReduce = null,                
                queryParams = {};
            if (query.searchIndex) {
                queryParams = query.searchIndex;
            }
            if (query.options) {
                queryParams = Ember.copy(query.options);
                if (query.sortKey || query.filterBy) {
                    if (query.sortDesc) {
                        queryParams.sortDesc = query.sortDesc;
                    }
                    if (query.sortKey) {
                        queryParams.sortKey = query.sortKey;
                    }
                    if (!this._doesStartKeyContainSpecialCharacters(queryParams.startkey)) {
                        queryParams.sortLimit = queryParams.limit;
                        delete queryParams.limit;
                        queryParams.sortStartKey = JSON.stringify(queryParams.startkey);
                        delete queryParams.startkey;
                    } else if (queryParams.startkey) {
                        queryParams.startkey = JSON.stringify(queryParams.startkey);
                    }
                    if (query.filterBy) {
                        queryParams.filterBy = JSON.stringify(query.filterBy);
                    }
                    if (queryParams.endkey) {
                        queryParams.endkey = JSON.stringify(queryParams.endkey);
                    }
                    query.useList = true;
                }
            }
            queryParams.reduce  = false;
            queryParams.include_docs = true;
            
            if (query.mapReduce) {
                mapReduce = query.mapReduce;
            } else if (query.containsValue) {
                return this._executeContainsSearch(store, type, query, options);
            }
            return new Ember.RSVP.Promise(function(resolve, reject){
                this._getDb().then(function(db){
                    try {
                        if (mapReduce) {
                            if (query.useList) {
                                var listParams = {
                                    query: queryParams
                                };
                                db.list(mapReduce+'/sort/'+mapReduce, listParams, function(err, response) {
                                    if (err) {
                                        this._pouchError(reject)(err);
                                    } else {
                                        this._handleQueryResponse(resolve, response.json, store, type, options);
                                    }
                                }.bind(this));
                            } else {
                                db.query(mapReduce, queryParams, function(err, response) {
                                    if (err) {
                                        this._pouchError(reject)(err);
                                    } else {
                                        this._handleQueryResponse(resolve, response, store, type, options);
                                    }
                                }.bind(this));
                            }
                        } else {
                            db.allDocs(queryParams, function(err, response) {
                                if (err) {
                                    this._pouchError(reject)(err);
                                } else {
                                    this._handleQueryResponse(resolve, response, store, type, options);
                                }
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