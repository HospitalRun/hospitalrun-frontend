import Ember from 'ember';
import HospitalRunVersion from 'hospitalrun/mixins/hospitalrun-version';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import UserSession from 'hospitalrun/mixins/user-session';
import Navigation from 'hospitalrun/mixins/navigation';
export default Ember.Controller.extend(HospitalRunVersion, ModalHelper, ProgressDialog, UserSession, Navigation, {
  application: Ember.inject.controller(),
  allowSearch: false,
  config: Ember.inject.service(),
  currentSearchText: null,
  currentRouteName: Ember.computed.alias('application.currentRouteName'),
  progressTitle: 'Searching',
  searchRoute: null,
  session: Ember.inject.service(),
  syncStatus: '',
  currentOpenNav: null,

  actions: {
    about: function() {
      let config = this.get('config'),
          version = this.get('version');
      config.getConfigValue('site_information', '').then((siteInfo) => {
        let message = `Version: ${version}`;
        if (!Ember.isEmpty(siteInfo)) {
          message += ` Site Info: ${siteInfo}`;
        }
        this.displayAlert('About HospitalRun', message);
      });
    },

    invalidateSession: function() {
      const session = this.get('session');
      if (session.get('isAuthenticated')) {
        session.invalidate();
      }
    },

    search: function() {
      if (this.allowSearch && this.searchRoute) {
        var currentRouteName = this.get('currentRouteName'),
          currentSearchText = this.get('currentSearchText'),
          textToFind = this.get('searchText');
        if (currentSearchText !== textToFind || currentRouteName.indexOf('.search') === -1) {
          this.set('searchText', '');
          this.set('progressMessage', 'Searching for ' + textToFind + '.  Please wait...');
          this.showProgressModal();
          this.transitionToRoute(this.searchRoute + '/' + textToFind);
        }
      }
    },

    navAction: function(nav) {
      if (this.currentOpenNav && this.currentOpenNav.route !== nav.route) {
        this.currentOpenNav.closeSubnav();
      }
      this.currentOpenNav = nav;
      this.transitionToRoute(nav.route);
      this.set('isShowingSettings', false);
    },

    toggleSettings: function() {
      this.toggleProperty('isShowingSettings');
    },

    closeSettings: function() {
      this.set('isShowingSettings', false);
    }

  }
});
