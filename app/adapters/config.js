export default DS.PouchDBAdapter.extend({
	namespace: 'hospitalrun-config',
    databaseName: 'config',
    
    init: function() {
        console.log("config pouch fired");
    },
    
    
    _getDb: function() {
        console.log("in _getDB, this.databaseName: "+this.databaseName);
      if (!this.db) {
        this.db = new PouchDB(this.databaseName || 'ember-application-db');
      }
      return this.db;
    }
});