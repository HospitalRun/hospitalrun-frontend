import Ember from 'ember';
import CheckForErrors from 'hospitalrun/mixins/check-for-errors';
import DS from 'ember-data';
import UserSession from 'hospitalrun/mixins/user-session';

const ENDPOINT = '/db/_users/';

const {
  RESTAdapter
} = DS;

const {
  computed,
  computed: {
    alias
  },
  get,
  inject
} = Ember;

export default RESTAdapter.extend(CheckForErrors, UserSession, {
  defaultSerializer: 'couchdb',

  config: inject.service(),
  database: inject.service(),
  session: inject.service(),

  oauthHeaders: alias('database.oauthHeaders'),
  standAlone: alias('config.standAlone'),
  usersDB: alias('database.usersDB'),

  headers: computed('oauthHeaders', function() {
    let oauthHeaders = get(this, 'oauthHeaders');
    if (Ember.isEmpty(oauthHeaders)) {
      return {};
    } else {
      return oauthHeaders;
    }
  }),

  ajaxError(jqXHR) {
    let error = this._super(jqXHR);
    if (jqXHR && jqXHR.status === 401) {
      let jsonErrors = Ember.$.parseJSON(jqXHR.responseText);
      window.Hospitalrun.__container__.lookup('controller:application').transitionToRoute('login');
      return new DS.InvalidError(jsonErrors);
    } else {
      return error;
    }
  },

  /**
  @method ajaxOptions Overriden here so that we can specify xhr with credentials
  @private
  @param {String} url
  @param {String} type The request type GET, POST, PUT, DELETE etc.
  @param {Object} options
  @return {Object} hash
  */
  ajaxOptions(url, type, options) {
    options = options || {};
    options.xhrFields = { withCredentials: true };
    return this._super(url, type, options);
  },

  /**
    Called by the store when a newly created record is
    saved via the `save` method on a model record instance.
    The `createRecord` method serializes the record and makes an Ajax (HTTP POST) request
    to a URL computed by `buildURL`.
    See `serialize` for information on how to customize the serialized form
    of a record.
    @method createRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
  */
  createRecord(store, type, snapshot) {
    return this.updateRecord(store, type, snapshot);
  },

  /**
    Called by the store when a record is deleted.
    The `deleteRecord` method  makes an Ajax (HTTP DELETE) request to a URL computed by `buildURL`.
    @method deleteRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
  */
  deleteRecord(store, type, snapshot) {
    return this.updateRecord(store, type, snapshot, true);
  },

  /**
    Called by the store in order to fetch the JSON for a given
    type and ID.
    The `findRecord` method makes an Ajax request to a URL computed by
    `buildURL`, and returns a promise for the resulting payload.
    This method performs an HTTP `GET` request with the id provided as part of the query string.
    @since 1.13.0
    @method findRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String} id
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
  */
  findRecord(store, type, id, snapshot) {
    if (get(this, 'standAlone') ===  true) {
      return this._offlineFind(id);
    } else {
      return this._checkForErrors(this._super(store, type, id, snapshot));
    }
  },

  /**
    Called by the store in order to fetch a JSON array for all
    of the records for a given type.
    The `findAll` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.
    @method findAll
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String} sinceToken
    @param {DS.SnapshotRecordArray} snapshotRecordArray
    @return {Promise} promise
  */
  findAll(store, type, sinceToken, snapshotRecordArray) {
    let ajaxData = {
      data: {
        include_docs: true,
        startkey: '"org.couchdb.user"'
      }
    };
    if (get(this, 'standAlone') ===  true) {
      return this._offlineFindAll(ajaxData);
    } else {
      let url = this.buildURL(type.modelName, null, snapshotRecordArray, 'findAll');
      return this._checkForErrors(this.ajax(url, 'GET', ajaxData));
    }
  },

  shouldReloadAll() {
    return true;
  },

  /**
   Called by the store when an existing record is saved
   via the `save` method on a model record instance.

   The `updateRecord` method serializes the record and makes an Ajax (HTTP PUT) request
   to a URL computed by `buildURL`.

   See `serialize` for information on how to customize the serialized form
   of a record.

   @method updateRecord
   @param {DS.Store} store
   @param {subclass of DS.Model} type
   @param {DS.Snapshot} record
   @param {boolean} deleteUser true if we are deleting the user.
   @returns {Promise} promise
  */
  updateRecord(store, type, record, deleteUser) {
    let data = {};
    let serializer = store.serializerFor(record.modelName);
    serializer.serializeIntoHash(data, type, record, { includeId: true });
    data.type = 'user';
    if (deleteUser) {
      data.deleted = true;
      delete data.oauth;
      data.roles = ['deleted'];
    }
    if (Ember.isEmpty(data._rev)) {
      delete data._rev;
    }
    data = this._cleanPasswordAttrs(data);
    if (get(this, 'standAlone') ===  true) {
      return this._offlineUpdateRecord(data);
    } else {
      let putURL = this._buildURL('user', get(record, 'id'));
      return this._checkForErrors(this.ajax(putURL, 'PUT', {
        data
      }));
    }
  },
  /**
   Builds a URL for a `store.findAll(type)` call.
   Example:
   ```app/adapters/comment.js
   import DS from 'ember-data';
   export default DS.JSONAPIAdapter.extend({
     urlForFindAll(id, modelName, snapshot) {
       return 'data/comments.json';
     }
   });
   ```
   @method urlForFindAll
   @param {String} modelName
   @param {DS.SnapshotRecordArray} snapshot
   @return {String} url
   */
  urlForFindAll(/* modelName, snapshot */) {
    return `${ENDPOINT}_all_docs`;
  },

  /**
    @method urlPrefix
    @private
    @param {String} path
    @param {String} parentURL
    @return {String} urlPrefix
  */
  urlPrefix(/* path, parentURL */) {
    return ENDPOINT;
  },

  /**
    @method _buildURL
    @private
    @param {String} modelName
    @param {String} id
    @return {String} url
  */
  _buildURL(modelName, id) {
    return `${ENDPOINT}${id}`;
  },

  /**
   Remove null/empty password fields from payload sent to server
   */
  _cleanPasswordAttrs(data) {
    let attrsToCheck = [
      'derived_key',
      'password',
      'password_scheme',
      'password_sha',
      'salt',
      'iterations'
    ];
    attrsToCheck.forEach(function(attr) {
      if (Ember.isEmpty(data[attr])) {
        delete data[attr];
      }
    });
    return data;
  },

  /**
   Called by find in we're in standAlone mode.
    @method private
    @param {String} id - document id we are retrieving
  @returns {Promise} promise
  */
  _offlineFind(id) {
    let usersDB = get(this, 'database.usersDB');
    return new Ember.RSVP.Promise((resolve, reject) => {
      usersDB.get(id).then(resolve).catch((err) => {
        let database = get(this, 'database');
        reject(database.handleErrorResponse(err));
      });
    });
  },

  /**
  Called by updateRecord in we're in standAlone mode.

  @method private
  @param {POJO} data - the data we're going to search for in Pouch
  @returns {Promise} promise
  */
  _offlineFindAll(data) {
    let usersDB = get(this, 'database.usersDB');
    return usersDB.allDocs(data);
  },

  /**
  Called by updateRecord in we're in standAlone mode.

  @method private
  @param {POJO} data - the data we're going to store in Pouch
  @returns {Promise} promise
  */
  _offlineUpdateRecord(data) {
    let usersDB = get(this, 'usersDB');
    return  usersDB.put(data);
  }

});
