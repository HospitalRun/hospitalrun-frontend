import Ember from 'ember';
import DS from 'ember-data';
import UserSession from 'hospitalrun/mixins/user-session';
export default DS.RESTAdapter.extend(UserSession, {
  session: Ember.inject.service(),
  endpoint: '/db/_users/',

  defaultSerializer: 'couchdb',

  ajaxError: function(jqXHR) {
    var error = this._super(jqXHR);
    if (jqXHR && jqXHR.status === 401) {
      var jsonErrors = Ember.$.parseJSON(jqXHR.responseText);
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
  @param {Object} hash
  @return {Object} hash
  */
  ajaxOptions: function(url, type, hash) {
    hash = hash || {};
    hash.xhrFields = { withCredentials: true };
    return this._super(url, type, hash);
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
   @param {subclass of DS.Model} type
   @param {DS.Model} record
   @returns {Promise} promise
  */
  createRecord: function(store, type, record) {
    return this.updateRecord(store, type, record);
  },

  /**
  Called by the store when a record is deleted.

  The `deleteRecord` method  makes an Ajax (HTTP DELETE) request to a URL computed by `buildURL`.

  @method deleteRecord
  @param {DS.Store} store
  @param {subclass of DS.Model} type
  @param {DS.Model} record
  @returns {Promise} promise
  */
  deleteRecord: function(store, type, record) {
    var ajaxData = {
      data: {
        id: record.get('id'),
        rev: record.get('rev')
      }
    };
    ajaxData.data.name = this.getUserName(true);
    return this.ajax('/deleteuser', 'POST', ajaxData);
  },

  /**
  Called by the store in order to fetch the JSON for a given
  type and ID.

  The `find` method makes an Ajax request to a URL computed by `buildURL`, and returns a
  promise for the resulting payload.

  This method performs an HTTP `GET` request with the id provided as part of the query string.

  @method find
  @param {DS.Store} store
  @param {subclass of DS.Model} type
  @param {String} id
  @returns {Promise} promise
  */
  find: function(store, type, id) {
    var ajaxData = {
      data: {
        id: id,
        name: this.getUserName(true)
      }
    };
    return this.ajax('/getuser', 'POST', ajaxData);
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
   @param {DS.Model} record
   @returns {Promise} promise
  */
  updateRecord: function(store, type, record) {
    var data = {};
    var serializer = store.serializerFor(record.modelName);
    serializer.serializeIntoHash(data, type, record, { includeId: true });
    data = data.user;
    data.type = 'user';
    var idToUpdate = data.id,
      revToUpdate = data.rev;
    delete data.id;
    delete data.rev;
    data = this._cleanPasswordAttrs(data);
    var ajaxData = {
      data: {
        data: data,
        updateParams: {
          doc_name: idToUpdate
        },
        name: this.getUserName(true)
      }
    };
    if (!Ember.isEmpty(revToUpdate)) {
      ajaxData.data.updateParams.rev = revToUpdate;
    }
    return this.ajax('/updateuser', 'POST', ajaxData);
  },

  /**
  Called by the store in order to fetch a JSON array for all
  of the records for a given type.

  The `findAll` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
  promise for the resulting payload.

  @private
  @method findAll
  @param {DS.Store} store //currently unused
  @param {subclass of DS.Model} type //currently unused
  @param {String} sinceToken //currently unused
  @returns {Promise} promise
  */
  findAll: function() {
    var ajaxData = {
      data: {
        name: this.getUserName(true)
      }
    };
    var allURL = '/allusers';
    return this.ajax(allURL, 'POST', ajaxData);
  },

  /**
   Remove null/empty password fields from payload sent to server
   */
  _cleanPasswordAttrs: function(data) {
    var attrsToCheck = [
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

  _getItemUrl: function(record) {
    var urlArray = [this.endpoint];
    urlArray.push(Ember.get(record, 'id'));
    var rev = Ember.get(record, 'rev');
    if (rev) {
      urlArray.push('?rev=');
      urlArray.push(rev);
    }
    return urlArray.join('');
  },

  shouldReloadAll: function() {
    return true;
  }

});
