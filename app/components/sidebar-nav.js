import Ember from 'ember';
import HospitalRunVersion from 'hospitalrun/mixins/hospitalrun-version';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import UserSession from 'hospitalrun/mixins/user-session';
import Navigation from 'hospitalrun/mixins/navigation';

export default Ember.Component.extend(HospitalRunVersion, ModalHelper, UserSession, Navigation, {
  ajax: Ember.inject.service(),
  allowSearch: false,
  config: Ember.inject.service(),
  i18n: Ember.inject.service(),
  progressTitle: 'Searching',
  session: Ember.inject.service(),
  syncStatus: '',
  currentOpenNav: null,
  selectedLanguage: null,

  actions: {
    about() {
      let version = this.get('version');
      this.get('ajax').request('/serverinfo').then((siteInfo) => {
        let message = `Version: ${version}`;
        if (!Ember.isEmpty(siteInfo)) {
          message += ` Site Info: ${siteInfo}`;
        }
        this.displayAlert(this.get('i18n').t('navigation.about'), message);
      });
    },

    invalidateSession() {
      let session = this.get('session');
      if (session.get('isAuthenticated')) {
        session.invalidate().catch(() => {
          let i18n = this.get('i18n');
          let message = i18n.t('navigation.messages.logoutFailed');
          let title = i18n.t('navigation.titles.logoutFailed');
          this.displayAlert(title, message);
        });
      }
    },

    search() {
      this.sendAction('search', this.get('searchText'));
    },

    navAction(nav) {
      if (this.currentOpenNav && this.currentOpenNav.route !== nav.route) {
        this.currentOpenNav.closeSubnav();
      }
      this.set('currentOpenNav', nav);

      // @todo replace with the router service as of https://www.emberjs.com/blog/2017/09/01/ember-2-15-released.html#toc_public-router-service-phase-1
      Ember.getOwner(this).lookup('router:main').transitionTo(nav.route);
      this.set('isShowingSettings', false);
    },

    toggleSettings() {
      this.toggleProperty('isShowingSettings');
    },

    closeSettings() {
      this.set('isShowingSettings', false);
    }
  }
});

