import {
  test, moduleForComponent
}
from 'ember-qunit';

moduleForComponent('nav-menu', 'NavMenuComponent', {});

test('it renders', function(assert) {

  assert.expect(2);

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
    }, {
      title: 'Items',
      iconClass: 'octicon-chevron-right',
      route: 'inventory.listing',
      capability: 'inventory'
    }]
  };

  // creates the component instance
  var navMenuProperties = { nav: startingMenu };
  var navMenu = this.subject( navMenuProperties );
  assert.equal(navMenu._state, 'preRender');

  // appends the navMenu to the page
  this.append();
  assert.equal(navMenu._state, 'inDOM');

});
