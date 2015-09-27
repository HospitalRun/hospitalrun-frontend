import Ember from 'ember';
import UserSession from "hospitalrun/mixins/user-session";

/**
NavMenu class resonsible for rendering logic
@Class NavMenu
*/
export default Ember.Component.extend(UserSession, {
    tagName: "div",
    classNames: ["primary-nav-item"],
    nav: null,

    /**
      Returns true if the menu should be displayed.
      Monitors changes to the nav model.
      @method show
    */
    show: function() {
        return this.currentUserCan(this.get("nav").capability);
    }.property("nav"),

    /**
    Current visibility state of the nav menu item.
    @attribute isShowing
    */
    isShowing: false,

    _setup: function() {
        var nav = this.get("nav");
        nav.closeSubnav = function() {
            this.set('isShowing', false);
        }.bind(this);
        nav.subnav.forEach(function(item) {
            item.show = this.currentUserCan(item.capability);
        }.bind(this));
    }.on('init'),

    callNavAction: "navAction",
    callCloseSettings: "closeSettings",

    actions: {
        toggleContent: function() {
            //debugger;
            this.set('isShowing', !this.get('isShowing'));
            this.sendAction('callNavAction', this.nav);
        },

        resetNav: function() {
            this.sendAction('callCloseSettings');
        }
    }
});
