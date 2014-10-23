export default Ember.Controller.extend({
    needs: ['filesystem','pouchdb'],
    filesystem: Ember.computed.alias('controllers.filesystem'),
    pouchdb: Ember.computed.alias('controllers.pouchdb'),
    
    _setup: function() {
        var fileSystem = this.get('filesystem'),
            pouchDB = this.get('pouchdb');
        fileSystem.setup();
        pouchDB.setup();
    }.on('init')
});