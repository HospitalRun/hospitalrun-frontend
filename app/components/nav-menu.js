import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';

export default Ember.Component.extend(UserSession, {
  tagName: 'div',
  classNames: ['primary-nav-item'],
  nav: null,

  show: function() {
    this._setupSubNav();
    return this.currentUserCan(this.get('nav').capability);
  }.property('nav', 'session.data.authenticated.userCaps'),

  isShowing: false,

  _setup: function() {
    let nav = this.get('nav');
    nav.closeSubnav = function() {
      this.set('isShowing', false);
    }.bind(this);
    this._setupSubNav();
  }.on('init'),

  _setupSubNav: function() {
    let nav = this.get('nav');
    nav.subnav.forEach((item) => {
      item.show = this.currentUserCan(item.capability);
    });
  },

  callNavAction: 'navAction',
  callCloseSettings: 'closeSettings',

  actions: {
    toggleContent: function() {
      this.set('isShowing', !this.get('isShowing'));
      this.sendAction('callNavAction', this.nav);
    },

    resetNav: function() {
      this.sendAction('callCloseSettings');
    }
  }
});
