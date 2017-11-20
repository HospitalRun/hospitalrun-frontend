import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import UserSession from 'hospitalrun/mixins/user-session';

export default Component.extend(UserSession, {
  callCloseSettings: 'closeSettings',
  callNavAction: 'navAction',
  classNames: ['primary-nav-item'],
  isShowing: false,
  nav: null,
  tagName: 'div',

  show: computed('nav', 'session.data.authenticated.userCaps', function() {
    this._setupSubNav();
    return this.currentUserCan(get(this, 'nav').capability);
  }),

  _setup: function() {
    let nav = get(this, 'nav');
    nav.closeSubnav = function() {
      set(this, 'isShowing', false);
    }.bind(this);
    this._setupSubNav();
  }.on('init'),

  _setupSubNav() {
    let nav = get(this, 'nav');
    nav.subnav.forEach((item) => {
      set(item, 'show', this.currentUserCan(item.capability));
    });
  },

  actions: {
    resetNav() {
      this.sendAction('callCloseSettings');
    },

    toggleContent() {
      this.toggleProperty('isShowing');
      this.sendAction('callNavAction', this.nav);
    }
  }
});
