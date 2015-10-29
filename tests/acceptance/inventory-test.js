import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | inventory', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /inventory', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/inventory');

  andThen(function() {
    assert.equal(currentURL(), '/inventory');
    findWithAssert('li a:contains(Requests)');
    findWithAssert('li a:contains(Items)');
    findWithAssert('li a:contains(Reports)');
    findWithAssert('button:contains(new request)');
    findWithAssert('p:contains(No requests found. )');
    findWithAssert('a:contains(Create a new request?)');
  });
  destroyDatabases();
});

test('Adding a new inventory item', (assert) => {
  loadPouchDump('default');
  authenticateUser();
  visit('/inventory/edit/new');

  andThen(() => {
    assert.equal(currentURL(), '/inventory/edit/new');
  });
  fillIn('.test-inv-name input', 'Biogesic');
  fillIn('textarea', 'Biogesic nga medisina');
  select('.test-inv-type', 'Medication');
  fillIn('.test-inv-cross input', '2600');
  fillIn('.test-inv-reorder input', '100');
  fillIn('.test-inv-price input', '5');
  select('.test-inv-dist-unit', 'tablet');
  fillIn('.test-inv-quantity input', '1000');
  fillIn('.test-inv-cost input', '4000');
  select('.test-inv-unit', 'tablet');
  fillIn('.test-vendor .tt-input', 'Alpha Pharmacy');
  triggerEvent('.test-vendor .tt-input', 'input');
  click('button:contains(Add)');
  waitToAppear('.modal-dialog');

  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Inventory Item Saved', 'Inventory Item was saved successfully');
  });
  click('button:contains(Ok)');

  andThen(() => {
    findWithAssert('button:contains(Add Purchase)');
    findWithAssert('button:contains(Update)');
    findWithAssert('button:contains(Return)');
  });

  click('button:contains(Return)');
  andThen(() => {
    assert.equal(currentURL(), '/inventory/listing');
    assert.equal(find('tr').length, 2, 'One item is listed');
  });
  destroyDatabases();
});

test('Creating a new inventory request', function(assert) {
  loadPouchDump('inventory');
  authenticateUser();
  visit('/inventory/request/new');

  andThen(function() {
    assert.equal(currentURL(), '/inventory/request/new');
  });
  fillIn('.test-inv-item .tt-input', 'Biogesic - m00001 (1000 available)');
  triggerEvent('.test-inv-item .tt-input', 'input');
  triggerEvent('.test-inv-item .tt-input', 'blur');
  fillIn('.test-inv-quantity input', 500);
  fillIn('.test-delivery-location .tt-input', 'Harare');
  fillIn('.test-delivery-aisle .tt-input', 'C100');
  fillIn('.test-bill-to .tt-input', 'Accounts Dept');
  click('button:contains(Add)');
  waitToAppear('.modal-dialog');

  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Request Updated', 'New request has been saved');
  });
  click('button:contains(Ok)');
  andThen(() => {
    findWithAssert('button:contains(Fulfill)');
    findWithAssert('button:contains(Cancel)');
  });
  click('button:contains(Cancel)');
  andThen(() => {
    assert.equal(currentURL(), '/inventory');
    assert.equal(find('tr').length, 3, 'Two requests are now displayed');
  });
  destroyDatabases();
});

test('Receiving inventory', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/inventory/batch/new');

  andThen(function() {
    assert.equal(currentURL(), '/inventory/batch/new');
  });
  destroyDatabases();
});
