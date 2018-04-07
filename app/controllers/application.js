import Ember from 'ember';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';

export default Ember.Controller.extend(ProgressDialog, {
  filesystem: Ember.inject.service(),
  session: Ember.inject.service(),

  allowSearch: false,
  currentSearchText: null,

  _setup: function() {
    let fileSystem = this.get('filesystem');
    fileSystem.setup();
  }.on('init'),

  actions: {
    search(textToFind) {
      if (this.allowSearch && this.searchRoute) {
        let currentRouteName = this.get('currentRouteName');
        let currentSearchText = this.get('currentSearchText');
        if (currentSearchText !== textToFind || currentRouteName.indexOf('.search') === -1) {
          this.set('progressMessage', `Searching for ${textToFind}. Please wait...`);
          this.showProgressModal();
          this.transitionToRoute(`${this.searchRoute}/${textToFind}`);
        }
      }
    }
  }
});
