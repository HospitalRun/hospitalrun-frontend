import Ember from 'ember';
export default Ember.Controller.extend({
  filesystem: Ember.inject.service(),
  _setup: function() {
    var fileSystem = this.get('filesystem');
    fileSystem.setup();
  }.on('init')
});
