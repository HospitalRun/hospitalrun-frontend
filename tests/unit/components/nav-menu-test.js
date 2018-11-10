import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('NavMenuComponent', function(hooks) {
  setupTest(hooks);

  test('it renders', function(assert) {

    assert.expect(2);

    let startingMenu = {
      title: 'Inventory',
      iconClass: 'octicon-package',
      route: 'inventory',
      capability: 'inventory',
      subnav: [{
        title: 'Requests',
        iconClass: 'octicon-chevron-right',
        route: 'inventory.index',
        capability: 'add_inventory_request'
      }, {
        title: 'Items',
        iconClass: 'octicon-chevron-right',
        route: 'inventory.listing',
        capability: 'inventory'
      }]
    };

    // creates the component instance
    let navMenuProperties = { nav: startingMenu };
    let navMenu = this.owner.factoryFor('component:nav-menu').create(navMenuProperties);
    assert.equal(navMenu._state, 'preRender');

    // appends the navMenu to the page
    this.render();
    assert.equal(navMenu._state, 'inDOM');

  });
});
