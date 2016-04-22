import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';

export default Ember.Component.extend(UserSession, {
  tagName: 'div',
  classNames: ['primary-nav-item'],
  nav: null,

  show: function() {
    return this.currentUserCan(this.get('nav').capability);
  }.property('nav', 'session.data.authenticated.userCaps'),

  isShowing: false,

  _setup: function() {
    var nav = this.get('nav');
    nav.closeSubnav = function() {
      this.set('isShowing', false);
    }.bind(this);
    nav.subnav.forEach(function(item) {
      item.show = this.currentUserCan(item.capability);
    }.bind(this));
  }.on('init'),

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
