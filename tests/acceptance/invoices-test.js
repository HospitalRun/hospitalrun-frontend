import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | invoices');

test('visiting /invoices', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');
  });
});

test('create invoice', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/invoices/edit/new');
    assert.equal(currentURL(), '/invoices/edit/new');

    await typeAheadFillIn('.invoice-patient', 'Joe Bagadonuts - TCH 00001');
    await waitToAppear('.invoice-visit option:contains((Admission))');
    await select('.invoice-visit', '(Admission)');
    await fillIn('.external-invoice-no input', 'inv000002');
    await waitToAppear('button:contains(Update)');
    await click('button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Invoice Saved', 'Invoice was saved successfully');
  });
});

test('print invoice', function(assert) {
  runWithPouchDump('billing', async function() {
    window.print = function() {}; // Disable browser print dialog.
    await authenticateUser();
    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');
    assert.equal(find('.invoice-number:contains(inv00001)').length, 1, 'Invoice is available for printing');

    await click('button:contains(Edit)');
    await waitToAppear('button:contains(Print)');
    await click('button:contains(Print)');
    assert.dom('.invoices-review').exists({ count: 1 }, 'Invoice is displayed for printing');
  });
});

// test pricing profile
test('pricing profiles', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/pricing/profiles');
    assert.equal(find('.btn-primary:contains(+ new item)').length, 1, 'We can add a new pricing profile');

    await click('button:contains(+ new item)');
    await waitToAppear('h4:contains(New Pricing Profile)');

    // % discount
    await fillIn('.pricing-profile-name input', '50% profile');
    await fillIn('.pricing-profile-percentage input', '50');
    await click('button:contains(Add)');
    await waitToAppear('button:contains(Ok)');
    await click('button:contains(Ok)');
    await click('button:contains(+ new item)');
    await waitToAppear('h4:contains(New Pricing Profile)');

    // flat discount
    await fillIn('.pricing-profile-name input', '$100 discount');
    await fillIn('.pricing-profile-discount input', '100');
    await click('button:contains(Add)');
    await waitToAppear('button:contains(Ok)');
    await click('button:contains(Ok)');
    await click('button:contains(+ new item)');
    await waitToAppear('h4:contains(New Pricing Profile)');

    // flat fee
    await fillIn('.pricing-profile-name input', '$150 fee');
    await fillIn('.pricing-set-fee input', '150');
    await click('button:contains(Add)');
    await waitToAppear('button:contains(Ok)');
    await click('button:contains(Ok)');

    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');
    assert.equal(find('.invoice-number:contains(inv00001)').length, 1, 'Invoice is available for modifying');

    await click('button:contains(Edit)');
  });
});

test('delete invoice', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');
    assert.equal(find('.invoice-number:contains(inv00001)').length, 1, 'Invoice is displayed for deletion');

    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.alert').hasText(
      'Are you sure you wish to delete inv00001?',
      'Invoice deletion confirm displays'
    );

    await click('button:contains(Delete):last');
    await waitToDisappear('.invoice-number:contains(inv00001)');
    assert.equal(find('.invoice-number:contains(inv00001)').length, 0, 'Invoice is deleted');
  });
});

test('add payment', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');

    await click('button:contains(Add Payment)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Add Payment', 'Add Payment modal displays');

    await fillIn('.payment-amount input', 100);
    await click('.update-payment-btn');
    await waitToAppear('.modal-title:contains(Payment Added)');
    assert.dom('.modal-title').hasText('Payment Added', 'Payment was saved successfully');

    await click('.modal-footer button:contains(Ok)');
    await waitToDisappear('.modal-dialog');
  });
});

test('add deposit', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');

    await click('button:contains(add deposit)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Add Deposit', 'Add Deposit modal displays');

    await fillIn('.payment-amount input', 140);
    await typeAheadFillIn('.payment-patient', 'Joe Bagadonuts - TCH 00001');
    await click('.update-payment-btn');
    await waitToAppear('.modal-title:contains(Deposit Added)');
    assert.dom('.modal-title').hasText('Deposit Added', 'Deposit was saved successfully');
  });
});

test('cashier role', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser({
      name: 'cashier@hospitalrun.io',
      roles: ['Cashier', 'user'],
      role: 'Cashier',
      prefix: 'p1'
    });

    await visit('/invoices');
    assert.equal(currentURL(), '/invoices');
    assert.dom('.primary-section-link').exists({ count: 2 }, 'Should have 2 navigations');
    assert.equal(find('.primary-section-link:contains(Scheduling)').length, 1, 'should see Scheduling navigation');
    assert.equal(find('.primary-section-link:contains(Billing)').length, 1,  'should see Billing navigation');

    assert.equal(find('li:contains(Billed)').length, 1, 'should see Billed selection');
    assert.equal(find('li:contains(Drafts)').length, 1, 'should see Drafts selection');
    assert.equal(find('li:contains(All Invoices)').length, 1, 'should see All Invoices selection');

    await click('a:contains(Billing)');
    assert.dom('.category-sub-item').exists({ count: 2 }, 'Should have 2 sub navigations');
  });
});

test('Searching invoices', function(assert) {
  runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit('/invoices');

    await fillIn('[role="search"] div input', 'Joe');
    await click('.glyphicon-search');

    assert.equal(currentURL(), '/invoices/search/Joe', 'Searched for Joe');
    assert.dom('.invoice-number').exists({ count: 1 }, 'There is one search item');

    await fillIn('[role="search"] div input', 'joe');
    await click('.glyphicon-search');

    assert.equal(currentURL(), '/invoices/search/joe', 'Searched for all lower case joe');
    assert.dom('.invoice-number').exists({ count: 1 }, 'There is one search item');

    await fillIn('[role="search"] div input', 'ItemNotFound');
    await click('.glyphicon-search');

    assert.equal(currentURL(), '/invoices/search/ItemNotFound', 'Searched for ItemNotFound');
    assert.dom('.invoice-number').doesNotExist('There is no search result');
  });
});
