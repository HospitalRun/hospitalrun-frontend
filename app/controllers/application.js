import Ember from "ember";
export default Ember.Controller.extend({
    needs: ['filesystem','pouchdb'],
    filesystem: Ember.computed.alias('controllers.filesystem'),
    pouchdb: Ember.computed.alias('controllers.pouchdb'),
    
    _setup: function() {
        var fileSystem = this.get('filesystem');
        fileSystem.setup();        
    }.on('init')
});