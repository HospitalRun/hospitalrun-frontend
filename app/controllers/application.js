import Ember from 'ember';
export default Ember.Controller.extend({
  filesystem: Ember.inject.service(),
  session: Ember.inject.service(),
  _setup: function() {
    let fileSystem = this.get('filesystem');
    fileSystem.setup();
  }.on('init')
});
