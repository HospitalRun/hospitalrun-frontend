import Ember from 'ember';
export default Ember.Controller.extend({
  filesystem: Ember.inject.service(),
  session: Ember.inject.service(),

  allowSearch: false,
  currentSearchText: null,

  _setup: function() {
    let fileSystem = this.get('filesystem');
    fileSystem.setup();
  }.on('init'),

  actions:{
    closeSettings() {
      this.set('isShowingSettings', false);
    }
  }
});
