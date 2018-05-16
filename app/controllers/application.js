<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Controller.extend({
  filesystem: Ember.inject.service(),
  session: Ember.inject.service(),
  _setup: function() {
    let fileSystem = this.get('filesystem');
    fileSystem.setup();
  }.on('init')
});
=======
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';

export default Controller.extend(ProgressDialog, {
  filesystem: service(),
  session: service(),

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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
