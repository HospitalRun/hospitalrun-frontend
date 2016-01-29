import DS from 'ember-data';
var couchSerializer = DS.JSONSerializer.extend({
  attrs: {
    rev: '_rev'
  },
  primaryKey: '_id',

  isNewSerializerAPI: true,

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    var newPayload = payload.rows.map(function(row) {
      return row.doc;
    }.bind(this));
    return this._super(store, primaryModelClass, newPayload, id, requestType);
  },

  normalizeSaveResponse: function(store, primaryModelClass, payload) {
    return {
      data: {
        id: payload.id,
        type: 'user',
        attrs: {
          rev: payload.rev
        }
      }
    };
  }

});

export default couchSerializer;
