import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | invoices');

test('visiting /invoices', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
    });
  });
});

test('create invoice', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/invoices/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/invoices/edit/new');
    });
    typeAheadFillIn('.invoice-patient', 'Joe Bagadonuts - TCH 00001');
    waitToAppear('.invoice-visit option:contains((Admission))');
    andThen(function() {
      select('.invoice-visit', '(Admission)');
      fillIn('.external-invoice-no input', 'inv000002');
    });
    waitToAppear('button:contains(Update)');
    andThen(function() {
      click('button:contains(Update)');
    });
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Invoice Saved', 'Invoice was saved successfully');
    });
  });
});

test('print invoice', function(assert) {
  runWithPouchDump('billing', function() {
    window.print = function() {}; // Disable browser print dialog.
    authenticateUser();
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
      assert.equal(find('.invoice-number:contains(inv00001)').length, 1, 'Invoice is available for printing');
      click('button:contains(Edit)');
      waitToAppear('button:contains(Print)');
    });
    andThen(function() {
      click('button:contains(Print)');
    });
    andThen(function() {
      assert.equal(find('.invoices-review').length, 1, 'Invoice is displayed for printing');
    });
  });
});

// test pricing profile
test('pricing profiles', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/pricing/profiles');
    andThen(function() {
      assert.equal(find('.btn-primary:contains(+ new item)').length, 1, 'We can add a new pricing profile');
      click('button:contains(+ new item)');
      waitToAppear('h4:contains(New Pricing Profile)');
    });
    // % discount
    andThen(function() {
      fillIn('.pricing-profile-name input', '50% profile');
      fillIn('.pricing-profile-percentage input', '50');
      click('button:contains(Add)');
      waitToAppear('button:contains(Ok)');
      click('button:contains(Ok)');
    });
    andThen(function() {
      click('button:contains(+ new item)');
      waitToAppear('h4:contains(New Pricing Profile)');
    });
    // flat discount
    andThen(function() {
      fillIn('.pricing-profile-name input', '$100 discount');
      fillIn('.pricing-profile-discount input', '100');
      click('button:contains(Add)');
      waitToAppear('button:contains(Ok)');
      click('button:contains(Ok)');
    });
    andThen(function() {
      click('button:contains(+ new item)');
      waitToAppear('h4:contains(New Pricing Profile)');
    });
    // flat fee
    andThen(function() {
      fillIn('.pricing-profile-name input', '$150 fee');
      fillIn('.pricing-set-fee input', '150');
      click('button:contains(Add)');
      waitToAppear('button:contains(Ok)');
      click('button:contains(Ok)');
    });
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
      assert.equal(find('.invoice-number:contains(inv00001)').length, 1, 'Invoice is available for modifying');
      click('button:contains(Edit)');
    });
  });
});

test('delete invoice', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
      assert.equal(find('.invoice-number:contains(inv00001)').length, 1, 'Invoice is displayed for deletion');
    });
    click('button:contains(Delete)');
    andThen(function() {
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.alert').text().trim(), 'Are you sure you wish to delete inv00001?', 'Invoice deletion confirm displays');
    });
    click('button:contains(Delete):last');
    waitToDisappear('.invoice-number:contains(inv00001)');
    andThen(() => {
      assert.equal(find('.invoice-number:contains(inv00001)').length, 0, 'Invoice is deleted');
    });
  });
});

test('add payment', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
    });
    click('button:contains(Add Payment)');
    waitToAppear('.modal-dialog');
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Add Payment', 'Add Payment modal displays');
    });
    fillIn('.payment-amount input', 100);
    click('.update-payment-btn');
    waitToAppear('.modal-title:contains(Payment Added)');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Payment Added', 'Payment was saved successfully');
      click('.modal-footer button:contains(Ok)');
      waitToDisappear('.modal-dialog');
    });
  });
});

test('add deposit', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
    });
    click('button:contains(add deposit)');
    waitToAppear('.modal-dialog');
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Add Deposit', 'Add Deposit modal displays');
    });
    fillIn('.payment-amount input', 140);
    typeAheadFillIn('.payment-patient', 'Joe Bagadonuts - TCH 00001');
    click('.update-payment-btn');
    waitToAppear('.modal-title:contains(Deposit Added)');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Deposit Added', 'Deposit was saved successfully');
    });
  });
});

test('cashier role', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser({
      name: 'cashier@hospitalrun.io',
      roles: ['Cashier', 'user'],
      role: 'Cashier',
      prefix: 'p1'
    });
    visit('/invoices');
    andThen(function() {
      assert.equal(currentURL(), '/invoices');
      assert.equal(find('.primary-section-link').length, 2, 'Should have 2 navigations');
      assert.equal(find('.primary-section-link:contains(Scheduling)').length, 1, 'should see Scheduling navigation');
      assert.equal(find('.primary-section-link:contains(Billing)').length, 1,  'should see Billing navigation');

      assert.equal(find('li:contains(Billed)').length, 1, 'should see Billed selection');
      assert.equal(find('li:contains(Drafts)').length, 1, 'should see Drafts selection');
      assert.equal(find('li:contains(All Invoices)').length, 1, 'should see All Invoices selection');
    });
    click('a:contains(Billing)');
    andThen(function() {
      assert.equal(find('.category-sub-item').length, 2, 'Should have 2 sub navigations');
    });
  });
});

test('Searching invoices', function(assert) {
  runWithPouchDump('billing', function() {
    authenticateUser();
    visit('/invoices');

    fillIn('[role="search"] div input', 'Joe');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/invoices/search/Joe', 'Searched for Joe');
      assert.equal(find('.invoice-number').length, 1, 'There is one search item');
    });

    fillIn('[role="search"] div input', 'joe');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/invoices/search/joe', 'Searched for all lower case joe');
      assert.equal(find('.invoice-number').length, 1, 'There is one search item');
    });
    fillIn('[role="search"] div input', 'ItemNotFound');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/invoices/search/ItemNotFound', 'Searched for ItemNotFound');
      assert.equal(find('.invoice-number').length, 0, 'There is no search result');
    });
  });
});
