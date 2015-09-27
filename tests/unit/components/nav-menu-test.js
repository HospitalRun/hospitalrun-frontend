import {
  test, moduleForComponent
}
from 'ember-qunit';
import startApp from '../../helpers/start-app';

// ************************************
// Setup
// ************************************

moduleForComponent('nav-menu', 'NavMenuComponent', {

  //Newer version of QUnit prefer 'beforeEach'
  setup: function() {

    var startingMenu = {
      title: 'Inventory',
      iconClass: 'octicon-package',
      route: 'inventory',
      capability: 'inventory',
      subnav: [{
        title: 'Requests',
        iconClass: 'octicon-chevron-right',
        route: 'inventory.index',
        capability: 'add_inventory_request'
      }]
    };

    var navMenuProperties = {
      nav: startingMenu,

      //Lets get mocky, and assign default user entitlement to whatever is provided in the model of each test
      currentUserCan: function() {
        return true;
      }
    };

    this.navMenu = this.subject(navMenuProperties);
    this.append();
  }
});

// ************************************
// Test Cases
// ************************************

test('it renders', function() {
  equal(this.navMenu._state, 'inDOM');
});

test('The nav menu is always collapsed on initial load', function() {
  equal(this.navMenu.isShowing, false);
});

test('The subnav menu is displayed', function() {
  equal(this.navMenu.nav.subnav[0].show, true);
});

test('The category title is displayed correctly', function() {
  equal($("div.category-title").text().trim(), 'Inventory');
  //Not worried about testing the routing setup here, just that the link-to
  equal($("a.primary-section-link").attr("href"), '#');
});
