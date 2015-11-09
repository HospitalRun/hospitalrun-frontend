import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | pricing', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /pricing', function(assert) {
  loadPouchDump('billing');
  authenticateUser();
  visit('/pricing');
  andThen(function() {
    assert.equal(currentURL(), '/pricing');
  });
  destroyDatabases();
});

test('create new price', function(assert) {
  loadPouchDump('billing');
  authenticateUser();
  visit('/pricing/edit/new');
  andThen(function() {
    assert.equal(currentURL(), '/pricing/edit/new');
    fillIn('.price-name input', 'Xray Foot');
    fillIn('.price-amount input', 100);
    fillIn('.price-department input', 'Imaging');
    select('.price-category', 'Imaging');
    select('.price-type', 'Imaging Procedure');
    click('button:contains(Add):last');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Pricing Item Saved', 'Pricing Item saved');
      click('button:contains(Ok)');
      andThen(() => {
        click('button:contains(Add Override)');
        waitToAppear('.modal-dialog');
        andThen(() => {
          assert.equal(find('.modal-title').text(), 'Add Override', 'Add Override Dialog displays');
          select('.pricing-profile', 'Half off');
          fillIn('.pricing-override-price input', 20);
          andThen(() => {
            click('button:contains(Add):last');
            waitToAppear('.override-profile');
            andThen(() => {
              assert.equal(find('.override-profile').text(), 'Half off', 'Pricing override saved');
            });
          });
        });
      });
    });
  });
  destroyDatabases();
});
