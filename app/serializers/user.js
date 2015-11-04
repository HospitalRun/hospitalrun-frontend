import DS from 'ember-data';
var couchSerializer = DS.JSONSerializer.extend({
  attrs: {
    id: '_id',
    rev: '_rev'
  },

  isNewSerializerAPI: true,

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    var newPayload = payload.rows.map(function(row) {
      return row.doc;
    }.bind(this));
    return this._super(store, primaryModelClass, newPayload, id, requestType);
  }

});

export default couchSerializer;
