import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import HospitalRunVersion from 'hospitalrun/mixins/hospitalrun-version';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import UserSession from 'hospitalrun/mixins/user-session';
import Navigation from 'hospitalrun/mixins/navigation';

export default Controller.extend(HospitalRunVersion, ModalHelper, ProgressDialog, UserSession, Navigation, {
  ajax: service(),
  application: controller(),
  allowSearch: false,
  config: service(),
  currentSearchText: null,
  currentRouteName: alias('application.currentRouteName'),
  progressTitle: 'Searching',
  searchRoute: null,
  session: service(),
  syncStatus: '',
  currentOpenNav: null,
  selectedLanguage: null,

  actions: {
    about() {
      let version = this.get('version');
      this.get('ajax').request('/serverinfo').then((siteInfo) => {
        let message = `Version: ${version}`;
        if (!isEmpty(siteInfo)) {
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
      if (this.allowSearch && this.searchRoute) {
        let currentRouteName = this.get('currentRouteName');
        let currentSearchText = this.get('currentSearchText');
        let textToFind = this.get('searchText');
        if (currentSearchText !== textToFind || currentRouteName.indexOf('.search') === -1) {
          this.set('searchText', '');
          this.set('progressMessage', `Searching for ${textToFind}. Please wait...`);
          this.showProgressModal();
          this.transitionToRoute(`${this.searchRoute}/${textToFind}`);
        }
      }
    },

    navAction(nav) {
      if (this.currentOpenNav && this.currentOpenNav.route !== nav.route) {
        this.currentOpenNav.closeSubnav();
      }
      this.set('currentOpenNav', nav);
      this.transitionToRoute(nav.route);
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
