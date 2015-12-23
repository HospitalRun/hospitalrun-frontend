import Ember from 'ember';
import { Adapter } from 'ember-pouch';
import PouchAdapterUtils from 'hospitalrun/mixins/pouch-adapter-utils';

export default Adapter.extend(PouchAdapterUtils, {
  database: Ember.inject.service(),
  db: Ember.computed.reads('database.mainDB'),

  _specialQueries: [
    'containsValue',
    'mapReduce',
    'searchIndex'
  ],

  _executeContainsSearch: function(store, type, query) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var typeName = this.getRecordTypeName(type);
      var searchUrl = `/search/hrdb/${typeName}/_search`;
      if (query.containsValue && query.containsValue.value) {
        var queryString = '';
        query.containsValue.keys.forEach(function(key) {
          if (!Ember.isEmpty(queryString)) {
            queryString = `${queryString} OR `;
          }
          queryString = `${queryString}${key}:${query.containsValue.value}`;
        });
        Ember.$.ajax(searchUrl, {
          dataType: 'json',
          data: {
            q: queryString
          },
          success: function(results) {
            if (results && results.hits && results.hits.hits) {
              var resultDocs = Ember.A(results.hits.hits).map(function(hit) {
                var mappedResult = hit._source;
                mappedResult.id = mappedResult._id;
                return mappedResult;
              });
              var response = {
                rows: resultDocs
              };
              this._handleQueryResponse(response, store, type).then(resolve, reject);
            } else if (results.rows) {
              this._handleQueryResponse(results, store, type).then(resolve, reject);
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

  _handleQueryResponse: function(response, store, type) {
    var database = this.get('database');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (response.rows.length > 0) {
        var ids = response.rows.map(function(row) {
          return database.getEmberId(row.id);
        });
        this.findRecord(store, type, ids).then(function(findResponse) {
          var primaryRecordName = type.modelName.camelize().pluralize(),
            sortedValues = [];
          // Sort response in order of ids
          ids.forEach(function(id) {
            var resolvedRecord = findResponse[primaryRecordName].findBy('id', id);
            sortedValues.push(resolvedRecord);
          });
          findResponse[primaryRecordName] = sortedValues;
          resolve(findResponse);
        }.bind(this), reject);
      } else {
        var emptyResponse = {};
        emptyResponse[type.modelName] = [];
        resolve(emptyResponse);
      }
    }.bind(this));
  },

  /**
   * @private
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

  generateIdForRecord: function() {
    return PouchDB.utils.uuid();
  },

  query: function(store, type, query, options) {
    var specialQuery = false;
    for (var i = 0; i < this._specialQueries.length; i++) {
      if (Ember.get(query, this._specialQueries[i])) {
        specialQuery = true;
        break;
      }
    }
    if (!specialQuery) {
      if (query.options) {
        this._init(store, type);
        var recordTypeName = this.getRecordTypeName(type);
        return this.get('db').rel.find(recordTypeName, query.options);
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
      queryParams.reduce = false;
      queryParams.include_docs = false;
      if (query.mapReduce) {
        mapReduce = query.mapReduce;
      } else if (query.containsValue) {
        return this._executeContainsSearch(store, type, query);
      }
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var db = this.get('db');
        try {
          if (mapReduce) {
            if (query.useList) {
              queryParams.include_docs = true;
              var listParams = {
                query: queryParams
              };
              db.list(`${mapReduce}/sort/${mapReduce}`, listParams, function(err, response) {
                if (err) {
                  this._pouchError(reject)(err);
                } else {
                  this._handleQueryResponse(response.json, store, type).then(resolve, reject);
                }
              }.bind(this));
            } else {
              db.query(mapReduce, queryParams, function(err, response) {
                if (err) {
                  this._pouchError(reject)(err);
                } else {
                  this._handleQueryResponse(response, store, type).then(resolve, reject);
                }
              }.bind(this));
            }
          } else {
            db.allDocs(queryParams, function(err, response) {
              if (err) {
                this._pouchError(reject)(err);
              } else {
                this._handleQueryResponse(response, store, type).then(resolve, reject);
              }
            }.bind(this));
          }
        } catch (err) {
          this._pouchError(reject)(err);
        }
      }.bind(this), 'findQuery in application-pouchdb-adapter');
    }
  }

});
