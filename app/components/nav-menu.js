import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend(UserSession, {
  callCloseSettings: 'closeSettings',
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
      this.sendAction('navAction', this.nav);
    }
  }
});
