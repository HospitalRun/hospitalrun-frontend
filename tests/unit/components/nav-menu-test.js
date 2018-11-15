import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module('NavMenuComponent', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

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
        capability: 'add_inventory_request',
        localizedTitle: 'First Menu Item'
      }, {
        title: 'Items',
        iconClass: 'octicon-chevron-right',
        route: 'inventory.listing',
        capability: 'inventory',
        localizedTitle: 'Second Menu Item'
      }]
    };

    let currentUserCanStub = () => true;

    this.set('nav', startingMenu);
    this.set("currentUserCanStub", currentUserCanStub);
    await render(hbs`{{nav-menu nav=nav isShowing=true currentUserCan=currentUserCanStub}}`);

    await assert.dom(".category-sub-items div:nth-child(1)").hasText('First Menu Item');
    await assert.dom(".category-sub-items div:nth-child(2)").hasText('Second Menu Item');
  });
});
