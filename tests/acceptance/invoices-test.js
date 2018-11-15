import { click, fillIn, find, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import jqueryLength from 'hospitalrun/tests/helpers/deprecated-jquery-length';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear, waitToDisappear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | invoices', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /invoices', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');
    });
  });

  test('create invoice', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices/edit/new');
      assert.equal(currentURL(), '/invoices/edit/new');

      await typeAheadFillIn('.invoice-patient', 'Joe Bagadonuts - TCH 00001');
      await waitToAppear('.invoice-visit option:contains((Admission))');
      await select('.invoice-visit', '(Admission)');
      await fillIn('.external-invoice-no input', 'inv000002');
      await waitToAppear('button:contains(Update)');
      await click(jquerySelect('button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Invoice Saved', 'Invoice was saved successfully');
    });
  });

  test('print invoice', function(assert) {
    return runWithPouchDump('billing', async function() {
      window.print = function() {}; // Disable browser print dialog.
      await authenticateUser();
      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');
      assert.equal(jqueryLength('.invoice-number:contains(inv00001)'), 1, 'Invoice is available for printing');

      await click(jquerySelect('button:contains(Edit)'));
      await waitToAppear('button:contains(Print)');
      await click(jquerySelect('button:contains(Print)'));
      assert.dom('.invoices-review').exists({ count: 1 }, 'Invoice is displayed for printing');
    });
  });

  // test pricing profile
  test('pricing profiles', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/pricing/profiles');
      assert.equal(jqueryLength('.btn-primary:contains(+ new item)'), 1, 'We can add a new pricing profile');

      await click(jquerySelect('button:contains(+ new item)'));
      await waitToAppear('h4:contains(New Pricing Profile)');

      // % discount
      await fillIn('.pricing-profile-name input', '50% profile');
      await fillIn('.pricing-profile-percentage input', '50');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('button:contains(Ok)');
      await click(jquerySelect('button:contains(Ok)'));
      await click(jquerySelect('button:contains(+ new item)'));
      await waitToAppear('h4:contains(New Pricing Profile)');

      // flat discount
      await fillIn('.pricing-profile-name input', '$100 discount');
      await fillIn('.pricing-profile-discount input', '100');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('button:contains(Ok)');
      await click(jquerySelect('button:contains(Ok)'));
      await click(jquerySelect('button:contains(+ new item)'));
      await waitToAppear('h4:contains(New Pricing Profile)');

      // flat fee
      await fillIn('.pricing-profile-name input', '$150 fee');
      await fillIn('.pricing-set-fee input', '150');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('button:contains(Ok)');
      await click(jquerySelect('button:contains(Ok)'));

      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');
      assert.equal(jqueryLength('.invoice-number:contains(inv00001)'), 1, 'Invoice is available for modifying');

      await click(jquerySelect('button:contains(Edit)'));
    });
  });

  test('delete invoice', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');
      assert.equal(jqueryLength('.invoice-number:contains(inv00001)'), 1, 'Invoice is displayed for deletion');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.alert').hasText(
        'Are you sure you wish to delete inv00001?',
        'Invoice deletion confirm displays'
      );

      await click(jquerySelect('button:contains(Delete):last'));
      await waitToDisappear('.invoice-number:contains(inv00001)');
      assert.equal(jqueryLength('.invoice-number:contains(inv00001)'), 0, 'Invoice is deleted');
    });
  });

  test('add payment', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');

      await click(jquerySelect('button:contains(Add Payment)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Add Payment', 'Add Payment modal displays');

      await fillIn('.payment-amount input', 100);
      await click('.update-payment-btn');
      await waitToAppear('.modal-title:contains(Payment Added)');
      assert.dom('.modal-title').hasText('Payment Added', 'Payment was saved successfully');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');
    });
  });

  test('add deposit', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');

      await click(jquerySelect('button:contains(add deposit)'));
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
    return runWithPouchDump('billing', async function() {
      await authenticateUser({
        name: 'cashier@hospitalrun.io',
        roles: ['Cashier', 'user'],
        role: 'Cashier',
        prefix: 'p1'
      });

      await visit('/invoices');
      assert.equal(currentURL(), '/invoices');
      assert.dom('.primary-section-link').exists({ count: 2 }, 'Should have 2 navigations');
      assert.equal(jqueryLength('.primary-section-link:contains(Scheduling)'), 1, 'should see Scheduling navigation');
      assert.equal(jqueryLength('.primary-section-link:contains(Billing)'), 1,  'should see Billing navigation');

      assert.equal(jqueryLength('li:contains(Billed)'), 1, 'should see Billed selection');
      assert.equal(jqueryLength('li:contains(Drafts)'), 1, 'should see Drafts selection');
      assert.equal(jqueryLength('li:contains(All Invoices)'), 1, 'should see All Invoices selection');

      await click(jquerySelect('a:contains(Billing)'));
      assert.dom('.category-sub-item').exists({ count: 2 }, 'Should have 2 sub navigations');
    });
  });

  test('Searching invoices', function(assert) {
    return runWithPouchDump('billing', async function() {
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

  test('Delete invoice line item detail', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices/edit/new');
      assert.equal(currentURL(), '/invoices/edit/new');

      await typeAheadFillIn('.invoice-patient', 'Joe Bagadonuts - TCH 00001');
      await waitToAppear('.invoice-visit option:contains((Admission))');
      await select('.invoice-visit', '(Admission)');

      await click('.glyphicon-plus');
      await click(jquerySelect('button:contains(Add Charge)'));

      // delete the first line item detail (second Delete button from top, as the very first is for the line item itself)
      await click($('button:contains(Delete):eq(1)')[0]);
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Charge', 'Delete Charge modal displays');
      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');

      // topmost detail showing should now be the blank one we added at beginning of this test
      assert.equal(find('.detail-quantity').value, '', 'First line item detail no longer appears.');
    });
  });

  test('Delete invoice line item', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices/edit/new');
      assert.equal(currentURL(), '/invoices/edit/new');

      await typeAheadFillIn('.invoice-patient', 'Joe Bagadonuts - TCH 00001');
      await waitToAppear('.invoice-visit option:contains((Admission))');
      await select('.invoice-visit', '(Admission)');

      await click(jquerySelect('button:contains(Delete):first'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Line Item', 'Delete Line Item modal displays');
      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');
      assert.equal(find('.item-name').value, 'Pharmacy', 'First line item no longer appears.');
    });
  });

  test('Calculate totals', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/invoices/edit/new');
      assert.equal(currentURL(), '/invoices/edit/new');

      await typeAheadFillIn('.invoice-patient', 'Joe Bagadonuts - TCH 00001');
      await waitToAppear('.invoice-visit option:contains((Admission))');
      await select('.invoice-visit', '(Admission)');

      // first item, discounts and details
      await fillIn(find('.item-discount'), '1');
      await fillIn(find('.item-national-insurance'), '2');
      await fillIn(find('.item-private-insurance'), '3');
      await click('.glyphicon-plus');
      await fillIn(find('.detail-price'), '3');
      await click(jquerySelect('button:contains(Add Charge)'));
      await fillIn(jquerySelect('.detail-quantity:eq(1)'), '60');
      await fillIn(jquerySelect('.detail-price:eq(1)'), '4');

      // second item, discounts and details
      await click('.glyphicon-plus');
      await fillIn(jquerySelect('.item-discount:eq(1)'), '4');
      await fillIn(jquerySelect('.item-national-insurance:eq(1)'), '6');
      await fillIn(jquerySelect('.item-private-insurance:eq(1)'), '1');
      await fillIn(jquerySelect('.detail-price:eq(2)'), '14');

      // add a payment
      await click(jquerySelect('button:contains(Add Payment):first'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Add Payment', 'Add Payment modal displays');
      await fillIn('.payment-amount input', '100');
      await click('.update-payment-btn');
      await waitToAppear('.modal-title:contains(Payment Added)');
      assert.dom('.modal-title').hasText('Payment Added', 'Payment was saved successfully');
      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');

      // total for first 2 items (2 details per item)
      let expected = +$('.detail-amount-owed:eq(0)').text() + +$('.detail-amount-owed:eq(1)').text();
      assert.dom($('.item-total:eq(0)')[0]).hasText(expected.toString(), 'First item total is correct');
      expected = +$('.detail-amount-owed:eq(2)').text() + +$('.detail-amount-owed:eq(3)').text();
      assert.dom($('.item-total:eq(1)')[0]).hasText(expected.toString(), 'Second item total is correct');

      // amount owed for first 2 items (2 details per item)
      expected = +$('.item-total:eq(0)').text() - (+$('.item-discount:eq(0)').val() + +$('.item-national-insurance:eq(0)').val() + +$('.item-private-insurance:eq(0)').val());
      assert.dom($('.item-amount-owed:eq(0)')[0]).hasText(expected.toString(), 'First item amount owed is correct');
      expected = +$('.item-total:eq(1)').text() - (+$('.item-discount:eq(1)').val() + +$('.item-national-insurance:eq(1)').val() + +$('.item-private-insurance:eq(1)').val());
      assert.dom($('.item-amount-owed:eq(1)')[0]).hasText(expected.toString(), 'Second item amount owed is correct');

      // detail amount owed for first 4 details
      expected = $('.detail-quantity:eq(0)').val() * $('.detail-price:eq(0)').val();
      assert.dom($('.detail-amount-owed:eq(0)')[0]).hasText(expected.toString(), 'First detail amount owed is correct');
      expected = $('.detail-quantity:eq(1)').val() * $('.detail-price:eq(1)').val();
      assert.dom($('.detail-amount-owed:eq(1)')[0]).hasText(expected.toString(), 'Second detail amount owed is correct');
      expected = $('.detail-quantity:eq(2)').val() * $('.detail-price:eq(2)').val();
      assert.dom($('.detail-amount-owed:eq(2)')[0]).hasText(expected.toString(), 'Third detail amount owed is correct');
      expected = $('.detail-quantity:eq(3)').val() * $('.detail-price:eq(3)').val();
      assert.dom($('.detail-amount-owed:eq(3)')[0]).hasText(expected.toString(), 'Fourth detail amount owed is correct');

      // category group and invoice total (same thing as this test only uses 1 category)
      expected = +$('.item-total:eq(0)').text() + +$('.item-total:eq(1)').text() + +$('.item-total:eq(2)').text() + +$('.item-total:eq(3)').text();
      assert.dom('.category-group-total').hasText(expected.toString(), 'Category group total is correct');
      expected = +$('.item-total:eq(0)').text() + +$('.item-total:eq(1)').text() + +$('.item-total:eq(2)').text() + +$('.item-total:eq(3)').text();
      assert.dom('.total').hasText(expected.toString(), 'Total is correct');

      // category group and invoice discount
      expected = +$('.item-discount:eq(0)').val() + +$('.item-discount:eq(1)').val();
      assert.dom('.category-group-discount').hasText(expected.toString(), 'Category group discount is correct');
      expected = +$('.item-discount:eq(0)').val() + +$('.item-discount:eq(1)').val();
      assert.dom('.discount').hasText(expected.toString(), 'Discount is correct');

      // category group and invoice national insurance
      expected = +$('.item-national-insurance:eq(0)').val() + +$('.item-national-insurance:eq(1)').val();
      assert.dom('.category-group-national-insurance').hasText(expected.toString(), 'Category group national insurance is correct');
      expected = +$('.item-national-insurance:eq(0)').val() + +$('.item-national-insurance:eq(1)').val();
      assert.dom('.national-insurance').hasText(expected.toString(), 'National insurance is correct');

      // category group and invoice private insurance
      expected = +$('.item-private-insurance:eq(0)').val() + +$('.item-private-insurance:eq(1)').val();
      assert.dom('.category-group-private-insurance').hasText(expected.toString(), 'Category group private insurance is correct');
      expected = +$('.item-private-insurance:eq(0)').val() + +$('.item-private-insurance:eq(1)').val();
      assert.dom('.private-insurance').hasText(expected.toString(), 'Private insurance is correct');

      // category group and invoice amount owed
      expected = +$('.item-amount-owed:eq(0)').text() + +$('.item-amount-owed:eq(1)').text() + +$('.item-amount-owed:eq(2)').text() + +$('.item-amount-owed:eq(3)').text();
      assert.dom('.category-group-amount-owed').hasText(expected.toString(), 'Category group amount owed is correct');
      expected = +$('.item-amount-owed:eq(0)').text() + +$('.item-amount-owed:eq(1)').text() + +$('.item-amount-owed:eq(2)').text() + +$('.item-amount-owed:eq(3)').text();
      assert.dom('.final-patient-responsibility').hasText(expected.toString(), 'Final patient responsibility is correct');

      // remaining balance after paid total is taken off
      expected = +$('.final-patient-responsibility:eq(0)').text() - Math.abs(+$('.paid-total:eq(0)').text());
      assert.dom('.remaining-balance').hasText(expected.toString(), 'Remaining balance is correct');
    });
  });
});
