import { click, fillIn, findAll, currentURL, visit, waitUntil } from '@ember/test-helpers';
import { findWithAssert } from 'ember-native-dom-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import jqueryLength from 'hospitalrun/tests/helpers/deprecated-jquery-length';
import moment from 'moment';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import selectDate from 'hospitalrun/tests/helpers/select-date';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | inventory', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /inventory', function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/inventory');
      assert.equal(currentURL(), '/inventory');
      findWithAssert(jquerySelect('button:contains(new request)'));
      findWithAssert(jquerySelect('button:contains(+ Inventory Received)'));
      findWithAssert(jquerySelect('p:contains(No requests found. )'));
      findWithAssert(jquerySelect('a:contains(Create a new request?)'));
    });
  });

  test('Adding a new inventory item', (assert) => {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/inventory/edit/new');
      assert.equal(currentURL(), '/inventory/edit/new');

      await fillIn('.test-inv-name input', 'Biogesic');
      await select('.test-inv-rank', 'B');
      await fillIn('textarea', 'Biogesic nga medisina');
      await select('.test-inv-type', 'Medication');
      await fillIn('.test-inv-cross input', '2600');
      await fillIn('.test-inv-reorder input', '100');
      await fillIn('.test-inv-price input', '5');
      await select('.test-inv-dist-unit', 'tablet');
      await fillIn('.test-inv-quantity input', '1000');
      await fillIn('.test-inv-cost input', '4000');
      await select('.test-inv-unit', 'tablet');
      await typeAheadFillIn('.test-vendor', 'Alpha Pharmacy');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Inventory Item Saved', 'Inventory Item was saved successfully');

      await click(jquerySelect('button:contains(Ok)'));
      findWithAssert(jquerySelect('button:contains(Add Purchase)'));
      findWithAssert(jquerySelect('button:contains(Update)'));
      findWithAssert(jquerySelect('button:contains(Return)'));

      await click(jquerySelect('button:contains(Add Purchase)'));
      await waitToAppear('.modal-dialog');
      await fillIn('.test-inv-quantity div div input', 18);
      await fillIn('.test-inv-cost div input', 2);
      await fillIn(findAll('.test-vendor div span input')[1], 'fakeVendor');
      await click('.modal-footer .btn-primary');
      assert.dom('div.alert.alert-danger.alert-dismissible').doesNotExist('Quantity error does not appear');
      assert.dom($('.test-location-quantity')[0]).hasText('1018', 'Location quantity is correct after new purchase');
      assert.dom('.test-inv-quantity p').hasText('1018', 'Item total quantity is correct after new purchase');

      await click(jquerySelect('button:contains(Return)'));

      await waitUntil(() => currentURL() === '/inventory/listing');
      assert.equal(currentURL(), '/inventory/listing');

      assert.dom('tr').exists({ count: 2 }, 'One item is listed');
    });
  });

  test('Items with negative quantites should not be saved', (assert) => {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/inventory/edit/new');
      assert.equal(currentURL(), '/inventory/edit/new');

      await fillIn('.test-inv-name input', 'Biogesic');
      await select('.test-inv-rank', 'B');
      await fillIn('textarea', 'Biogesic nga medisina');
      await select('.test-inv-type', 'Medication');
      await fillIn('.test-inv-cross input', '2600');
      await fillIn('.test-inv-reorder input', '100');
      await fillIn('.test-inv-price input', '5');
      await select('.test-inv-dist-unit', 'tablet');
      await fillIn('.test-inv-quantity input', '-1000');
      await fillIn('.test-inv-cost input', '4000');
      await select('.test-inv-unit', 'tablet');
      await typeAheadFillIn('.test-vendor', 'Alpha Pharmacy');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('.modal-dialog');

      assert.dom('.modal-title').hasText(
        'Warning!!!!',
        'Inventory Item with negative quantity should not be saved.'
      );

      await click(jquerySelect('button:contains(Ok)'));
      assert.equal(currentURL(), '/inventory/edit/new');
      findWithAssert(jquerySelect('button:contains(Add)'));
      findWithAssert(jquerySelect('button:contains(Cancel)'));
      assert.dom('.test-inv-quantity .help-block').hasText(
        'not a valid number',
        'Error message should be present for invalid quantities'
      );
    });
  });

  test('Visiting /inventory/barcode', (assert) => {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory/listing');
      assert.equal(currentURL(), '/inventory/listing');

      await click(jquerySelect('a:contains(Barcode)'));
      assert.equal(currentURL(), '/inventory/barcode/igbmk5zf_is');
      findWithAssert('.panel-body img[src^="data:image"]');
    });
  });

  test('Deleting the last inventory item', (assert) => {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory/listing');
      assert.equal(currentURL(), '/inventory/listing');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Item', 'Deleting confirmation.');

      await click(jquerySelect('.modal-content button:contains(Delete)'));
      await waitToAppear('.panel-body .alert-info');
      assert.equal(currentURL(), '/inventory/listing');
      findWithAssert(jquerySelect('a:contains(Create a new record?)'));
    });
  });

  test('Creating a new inventory request', function(assert) {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory/request/new');
      assert.equal(currentURL(), '/inventory/request/new');

      await typeAheadFillIn('.test-inv-item', 'Biogesic - m00001 (1000 available)');
      await fillIn('.test-inv-quantity input', 500);
      await typeAheadFillIn('.test-delivery-location', 'Harare');
      await typeAheadFillIn('.test-delivery-aisle', 'C100');
      await typeAheadFillIn('.test-bill-to', 'Accounts Dept');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Request Updated', 'New request has been saved');

      await click(jquerySelect('button:contains(Ok)'));
      findWithAssert(jquerySelect('button:contains(Fulfill)'));
      findWithAssert(jquerySelect('button:contains(Cancel)'));

      await click(jquerySelect('button:contains(Cancel)'));
      await waitUntil(() => currentURL() === '/inventory');
      assert.equal(currentURL(), '/inventory');
      assert.dom('tr').exists({ count: 3 }, 'Two requests are now displayed');
    });
  });

  test('Fulfilling an inventory request', function(assert) {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory');
      assert.equal(currentURL(), '/inventory');
      let tableRows = findAll('tr').length;
      assert.equal(tableRows, 2, 'One request not fulfilled');

      await click(jquerySelect('button:contains(Fulfill)'));
      findWithAssert(jquerySelect('button:contains(Fulfill)'));
      findWithAssert(jquerySelect('button:contains(Cancel)'));

      await waitToAppear(jquerySelect('.inventory-location option:contains(No Location)'));
      await click(jquerySelect('button:contains(Fulfill)'));
      await waitToAppear('.modal-dialog');

      assert.dom('.modal-title').hasText('Request Fulfilled', 'Inventory request has been fulfilled');

      await click(jquerySelect('button:contains(Ok)'));

      await waitUntil(() => currentURL() === '/inventory');
      assert.equal(currentURL(), '/inventory');
    });
  });

  test('Deleting an inventory request', function(assert) {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory');
      assert.equal(currentURL(), '/inventory', 'Navigated to /inventory');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one request');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Item', 'Deleting confirmation');

      await click(jquerySelect('.modal-content button:contains(Delete)'));
      await waitToAppear('.panel-body .alert-info');
      assert.equal(currentURL(), '/inventory', 'Navigated to /inventory');
      assert.equal(jqueryLength('button:contains(Delete)'), 0, 'Request was deleted');
    });
  });

  test('User with add_inventory_request and without fulfill_inventory rights should not be able to delete others\' requests', function(assert) {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser({
        name: 'nurse.mgr',
        roles: ['Nurse Manager', 'user'],
        role: 'Nurse Manager'
      });
      await visit('/inventory');

      assert.equal(currentURL(), '/inventory', 'Navigated to /inventory');
      assert.equal(jqueryLength('button:contains(Delete)'), 0, 'User doesn\'t see Delete button');
    });
  });

  test('Receiving inventory', function(assert) {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory/batch/new');
      assert.equal(currentURL(), '/inventory/batch/new');

      await typeAheadFillIn('.test-vendor', 'Alpha Pharmacy');
      await fillIn('.test-invoice-number input', 'P2345');
      await typeAheadFillIn('.test-inv-item', 'Biogesic - m00001');
      await fillIn('.test-inv-quantity input', 500);
      await fillIn('.test-inv-cost input', '2000');
      await waitToAppear('.inventory-distribution-unit');
      await click(jquerySelect('button:contains(Save)'));
      await waitToAppear('.modal-title');

      assert.dom('.modal-title').hasText('Inventory Purchases Saved', 'Inventory has been received');

      await click(jquerySelect('button:contains(Ok)'));

      await waitUntil(() => currentURL() === '/inventory/listing');
      assert.equal(currentURL(), '/inventory/listing');
    });
  });

  test('Searching inventory', function(assert) {
    return runWithPouchDump('inventory', async function() {
      await authenticateUser();
      await visit('/inventory');

      await fillIn('[role="search"] div input', 'Biogesic');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/inventory/search/Biogesic', 'Searched for Biogesic');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'biogesic');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/inventory/search/biogesic', 'Searched with all lower case ');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'ItemNotFound');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/inventory/search/ItemNotFound', 'Searched for ItemNotFound');
      assert.equal(jqueryLength('button:contains(Delete)'), 0, 'There is no search result');
    });
  });

  let startAndEndDateReportTypes = [
    'Days Supply Left In Stock',
    'Detailed Adjustment',
    'Detailed Purchase',
    'Detailed Stock Usage',
    'Detailed Stock Transfer',
    'Detailed Expenses',
    'Expiration Date',
    'Summary Expenses',
    'Summary Purchase',
    'Summary Stock Usage',
    'Summary Stock Transfer',
    'Finance Summary'
  ];

  let singleDateReportTypes = [
    'Inventory By Location',
    'Inventory Valuation'
  ];

  startAndEndDateReportTypes.forEach((reportName) => {
    testSimpleReportForm(reportName);
    testReportWithEmptyEndDate(reportName);
    testReportWithEmptyEndDateBeforeStartDate(reportName);
  });

  singleDateReportTypes.forEach((reportName) => {
    testSingleDateReportForm(reportName);
  });

  function testSimpleReportForm(reportName) {
    test(`${reportName} report can be generated`, function(assert) {
      return runWithPouchDump('default', async function() {
        await authenticateUser();
        await visit('/inventory/reports');
        assert.equal(currentURL(), '/inventory/reports');

        let startDate = moment('2015-10-01');
        let endDate = moment('2015-10-31');
        await selectDate('.test-start-date input', startDate.toDate());
        await selectDate('.test-end-date input', endDate.toDate());
        await select('#report-type', `${reportName}`);
        await click(jquerySelect('button:contains(Generate Report)'));
        await waitToAppear('.panel-title');
        let reportTitle = `${reportName} Report ${startDate.format('l')} - ${endDate.format('l')}`;
        assert.dom('.panel-title').hasText(reportTitle, `${reportName} Report generated`);
        let exportLink = findWithAssert(jquerySelect('a:contains(Export Report)'));
        assert.equal($(exportLink).attr('download'), `${reportTitle}.csv`);
      });
    });
  }

  async function generateReport(reportName, startDate, endDate) {
    await authenticateUser();
    await visit('/inventory/reports');

    if (startDate) {
      await selectDate('.test-start-date input', moment(startDate).toDate());
    }

    if (endDate) {
      await selectDate('.test-end-date input', moment(endDate).toDate());
    }

    await select('#report-type', `${reportName}`);
    await click(jquerySelect('button:contains(Generate Report)'));
  }

  function testReportWithEmptyEndDateBeforeStartDate(reportName) {
    test(`${reportName} report with end date before start date should display an error`, (assert) => {
      return runWithPouchDump('default', async function() {
        let endDate = '12/10/2016';
        let startDate = '12/11/2016';
        await generateReport(reportName, startDate, endDate);
        await waitToAppear('.modal-dialog');
        assert.dom('.modal-title').hasText('Error Generating Report', 'Error Generating Report');
        assert.dom('.modal-body').hasText('Please enter an end date after the start date.');
      });
    });
  }

  function testReportWithEmptyEndDate(reportName) {
    test(`${reportName} report can be generated with empty end date`, function(assert) {
      return runWithPouchDump('default', async function() {

        let startDate = '12/11/2016';
        let endDate = new Date();
        await generateReport(reportName, startDate, null);
        await waitToAppear('.panel-title');
        assert.equal(currentURL(), '/inventory/reports');
        let reportTitle = `${reportName} Report ${moment(startDate).format('l')} - ${moment(endDate).format('l')}`;
        assert.dom('.panel-title').hasText(reportTitle, `${reportName} Report generated`);
        let exportLink = findWithAssert(jquerySelect('a:contains(Export Report)'));
        assert.equal($(exportLink).attr('download'), `${reportTitle}.csv`);
      });
    });
  }

  function testSingleDateReportForm(reportName) {
    test(`${reportName} report can be generated`, function(assert) {
      return runWithPouchDump('default', async function() {
        let startDate = new Date();
        await generateReport(reportName, null, null);
        await waitToAppear('.panel-title');
        assert.equal(currentURL(), '/inventory/reports');
        let reportTitle = `${reportName} Report ${moment(startDate).format('l')}`;
        assert.dom('.panel-title').hasText(reportTitle, `${reportName} Report generated`);
        let exportLink = findWithAssert(jquerySelect('a:contains(Export Report)'));
        assert.equal($(exportLink).attr('download'), `${reportTitle}.csv`);
      });
    });
  }
});
