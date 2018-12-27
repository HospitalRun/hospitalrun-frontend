import { copy } from '@ember/object/internals';
import { Promise as EmberPromise } from 'rsvp';
import { A, isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { get } from '@ember/object';
import { bind } from '@ember/runloop';
import CheckForErrors from 'hospitalrun/mixins/check-for-errors';
import uuid from 'uuid';
import withTestWaiter from 'ember-concurrency-test-waiter/with-test-waiter';
import { Adapter } from 'ember-pouch';
import { task } from 'ember-concurrency';
import { pluralize } from 'ember-inflector';

export default Adapter.extend(CheckForErrors, {
  ajax: service(),
  database: service(),
  db: reads('database.mainDB'),
  usePouchFind: reads('database.usePouchFind'),

  _specialQueries: [
    'containsValue',
    'mapReduce'
  ],

  _esDefaultSize: 25,

  _executeContainsSearch(store, type, query) {
    let usePouchFind = get(this, 'usePouchFind');
    if (usePouchFind) {
      return this._executePouchDBFind(store, type, query);
    }
    let typeName = this.getRecordTypeName(type);
    let searchUrl = `/search/hrdb/${typeName}/_search`;
    if (query.containsValue && query.containsValue.value) {
      let queryString = '';
      query.containsValue.keys.forEach((key) => {
        if (!isEmpty(queryString)) {
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
      let ajax = get(this, 'ajax');
      if (isEmpty(query.size)) {
        query.size = this.get('_esDefaultSize');
      }

      return ajax.request(searchUrl, {
        dataType: 'json',
        data: {
          q: queryString,
          size: this.get('_esDefaultSize')
        }
      }).then((results) => {
        if (results && results.hits && results.hits.hits) {
          let resultDocs = A(results.hits.hits).map((hit) => {
            let mappedResult = hit._source;
            mappedResult.id = hit._id;
            return mappedResult;
          });
          let response = {
            rows: resultDocs
          };
          return this._handleQueryResponse(response, store, type);
        } else if (results.rows) {
          return this._handleQueryResponse(results, store, type);
        } else {
          throw new Error('Search results are not valid');
        }
      }).catch(() => {
        // Try pouch db find if ajax fails
        return this._executePouchDBFind(store, type, query);
      });
    } else {
      throw new Error('invalid query');
    }
  },

  _executePouchDBFind(store, type, query) {
    this._init(store, type);
    let db = this.get('db');
    let recordTypeName = this.getRecordTypeName(type);
    let queryParams = {
      selector: {
        $and: [{}, { $or: [] }]
      }
    };
    // filter to only retrieve the specified type of record. relational-pouch may eventually provide
    // a better way to do this and allow this workaround to be removed
    queryParams.selector.$and[0]._id = {
      '$gt': db.rel.makeDocID({ type: recordTypeName }),
      '$lt': db.rel.makeDocID({ type: recordTypeName, id: {} })
    };
    if (query.containsValue && query.containsValue.value) {
      let regexp = new RegExp(query.containsValue.value, 'i');
      query.containsValue.keys.forEach((key) => {
        let subQuery = {};
        subQuery[`data.${key.name}`] = { $regex: regexp };
        queryParams.selector.$and[1].$or.push(subQuery);
      });
    }

    return db.find(queryParams).then((pouchRes) => {
      return db.rel.parseRelDocs(recordTypeName, pouchRes.docs);
    });
  },

  _handleQueryResponse(response, store, type) {
    let database = this.get('database');
    return new EmberPromise((resolve, reject) => {
      if (response.rows.length > 0) {
        let ids = response.rows.map((row) => {
          return database.getEmberId(row.id);
        });
        this.findRecord(store, type, ids).then((findResponse) => {
          let primaryRecordName = pluralize(type.modelName.camelize());
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
    if (!isEmpty(startkey) && isArray(startkey)) {
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
      ).on('error', function() {}); // Change sometimes throws weird 500 errors that we can ignore
      db.changesListener = this.changes;
    }
  },

  generateIdForRecord() {
    return uuid.v4();
  },

  query(store, type, query, options) {
    let specialQuery = false;
    for (let i = 0; i < this._specialQueries.length; i++) {
      if (get(query, this._specialQueries[i])) {
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
        queryParams = copy(query.options);
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
      return new EmberPromise((resolve, reject) => {
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

  checkForErrorsTask: withTestWaiter(task(function* (callPromise) {
    return yield new EmberPromise((resolve, reject) => {
      callPromise.then(resolve, (err) => {
        let database = get(this, 'database');
        reject(database.handleErrorResponse(err));
      });
    });
  })),

  _checkForErrors(callPromise) {
    return get(this, 'checkForErrorsTask').perform(callPromise);
  }

});
