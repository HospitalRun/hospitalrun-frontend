import Ember from 'ember';
import { Adapter } from 'ember-pouch';
import uuid from 'npm:uuid';

const {
  get,
  run: {
    bind
  }
} = Ember;

export default Adapter.extend({
  database: Ember.inject.service(),
  db: Ember.computed.reads('database.mainDB'),

  _specialQueries: [
    'containsValue',
    'mapReduce'
  ],

  _esDefaultSize: 25,

  _executeContainsSearch(store, type, query) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let typeName = this.getRecordTypeName(type);
      let searchUrl = `/search/hrdb/${typeName}/_search`;
      if (query.containsValue && query.containsValue.value) {
        let queryString = '';
        query.containsValue.keys.forEach((key) => {
          if (!Ember.isEmpty(queryString)) {
            queryString = `${queryString} OR `;
          }
          let queryValue = query.containsValue.value;
          switch (key.type) {
            case 'contains': {
              queryValue = `*${queryValue}*`;
              break;
            }
            case 'fuzzy': {
              queryValue = `${queryValue}~`;
              break;
            }
          }
          queryString = `${queryString}data.${key.name}:${queryValue}`;
        });
        let successFn = (results) => {
          if (results && results.hits && results.hits.hits) {
            let resultDocs = Ember.A(results.hits.hits).map((hit) => {
              let mappedResult = hit._source;
              mappedResult.id = mappedResult._id;
              return mappedResult;
            });
            let response = {
              rows: resultDocs
            };
            this._handleQueryResponse(response, store, type).then(resolve, reject);
          } else if (results.rows) {
            this._handleQueryResponse(results, store, type).then(resolve, reject);
          } else {
            reject('Search results are not valid');
          }
        };

        if (Ember.isEmpty(query.size)) {
          query.size = this.get('_esDefaultSize');
        }

        Ember.$.ajax(searchUrl, {
          dataType: 'json',
          data: {
            q: queryString,
            size: this.get('_esDefaultSize')
          },
          success: successFn
        });
      } else {
        reject('invalid query');
      }
    });
  },

  _handleQueryResponse(response, store, type) {
    let database = this.get('database');
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (response.rows.length > 0) {
        let ids = response.rows.map((row) => {
          return database.getEmberId(row.id);
        });
        this.findRecord(store, type, ids).then((findResponse) => {
          let primaryRecordName = type.modelName.camelize().pluralize();
          let sortedValues = [];
          // Sort response in order of ids
          ids.forEach((id) => {
            let resolvedRecord = findResponse[primaryRecordName].findBy('id', id);
            sortedValues.push(resolvedRecord);
          });
          findResponse[primaryRecordName] = sortedValues;
          resolve(findResponse);
        }, reject);
      } else {
        let emptyResponse = {};
        emptyResponse[type.modelName] = [];
        resolve(emptyResponse);
      }
    });
  },

  /**
   * @private
   * Look for nulls and maxvalues in start key because those keys can't be handled by the sort/list function
   */
  _doesStartKeyContainSpecialCharacters(startkey) {
    let haveSpecialCharacters = false;
    let maxValue = this.get('maxValue');
    if (!Ember.isEmpty(startkey) && Ember.isArray(startkey)) {
      startkey.forEach((keyvalue) => {
        if (keyvalue === null || keyvalue === maxValue) {
          haveSpecialCharacters = true;
        }
      });
    }
    return haveSpecialCharacters;
  },

  _startChangesToStoreListener() {
    let db = this.get('db');
    if (db) {
      this.changes = db.changes({
        since: 'now',
        live: true,
        returnDocs: false
      }).on('change', bind(this, 'onChange')
      ).on('error', Ember.K); // Change sometimes throws weird 500 errors that we can ignore
      db.changesListener = this.changes;
    }
  },

  generateIdForRecord() {
    return uuid.v4();
  },

  query(store, type, query, options) {
    let specialQuery = false;
    for (let i = 0; i < this._specialQueries.length; i++) {
      if (Ember.get(query, this._specialQueries[i])) {
        specialQuery = true;
        break;
      }
    }

    if (!specialQuery) {
      if (query.options) {
        this._init(store, type);
        let recordTypeName = this.getRecordTypeName(type);
        return this.get('db').rel.find(recordTypeName, query.options);
      } else {
        return this._super(store, type, query, options);
      }
    } else {
      let mapReduce = null;
      let queryParams = {};
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
      let database = get(this, 'database');
      return new Ember.RSVP.Promise((resolve, reject) => {
        let db = this.get('db');
        try {
          if (mapReduce) {
            if (query.useList) {
              queryParams.include_docs = true;
              let listParams = {
                query: queryParams
              };
              db.list(`${mapReduce}/sort/${mapReduce}`, listParams, (err, response) => {
                if (err) {
                  reject(database.handleErrorResponse(err));
                } else {
                  let responseJSON = JSON.parse(response.body);
                  this._handleQueryResponse(responseJSON, store, type).then(resolve, reject);
                }
              });
            } else {
              db.query(mapReduce, queryParams, (err, response) => {
                if (err) {
                  reject(database.handleErrorResponse(err));
                } else {
                  this._handleQueryResponse(response, store, type).then(resolve, reject);
                }
              });
            }
          } else {
            db.allDocs(queryParams, (err, response) => {
              if (err) {
                reject(database.handleErrorResponse(err));
              } else {
                this._handleQueryResponse(response, store, type).then(resolve, reject);
              }
            });
          }
        } catch(err) {
          reject(database.handleErrorResponse(err));
        }
      }, 'findQuery in application-pouchdb-adapter');
    }
  },

  createRecord(store, type, record) {
    return this._checkForErrors(this._super(store, type, record));
  },

  findAll(store, type) {
    return this._checkForErrors(this._super(store, type));
  },

  findMany(store, type, ids) {
    return this._checkForErrors(this._super(store, type, ids));
  },

  findHasMany(store, record, link, rel) {
    return this._checkForErrors(this._super(store, record, link, rel));
  },

  findRecord(store, type, id) {
    return this._checkForErrors(this._super(store, type, id));
  },

  updateRecord(store, type, record) {
    return this._checkForErrors(this._super(store, type, record));
  },

  deleteRecord(store, type, record) {
    return this._checkForErrors(this._super(store, type, record));
  },

  _checkForErrors(callPromise) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      callPromise.then(resolve, (err) => {
        let database = get(this, 'database');
        reject(database.handleErrorResponse(err));
      });
    });
  }

});
