import moment from 'moment';
import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import selectDate from 'hospitalrun/tests/helpers/select-date';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | inventory');

test('visiting /inventory', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/inventory');
    assert.equal(currentURL(), '/inventory');
    findWithAssert('button:contains(new request)');
    findWithAssert('button:contains(+ Inventory Received)');
    findWithAssert('p:contains(No requests found. )');
    findWithAssert('a:contains(Create a new request?)');
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
    await click('button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Inventory Item Saved', 'Inventory Item was saved successfully');

    await click('button:contains(Ok)');
    findWithAssert('button:contains(Add Purchase)');
    findWithAssert('button:contains(Update)');
    findWithAssert('button:contains(Return)');

    await click('button:contains(Add Purchase)');
    await waitToAppear('.modal-dialog');
    await fillIn('.test-inv-quantity div div input', 18);
    await fillIn('.test-inv-cost div input', 2);
    await fillIn('.test-vendor div span input:eq(1)', 'fakeVendor');
    await click('.modal-footer .btn-primary');
    assert.dom('div.alert.alert-danger.alert-dismissible').doesNotExist('Quantity error does not appear');
    assert.dom($('.test-location-quantity')[0]).hasText('1018', 'Location quantity is correct after new purchase');
    assert.dom('.test-inv-quantity p').hasText('1018', 'Item total quantity is correct after new purchase');

    await click('button:contains(Return)');
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
    await click('button:contains(Add)');
    await waitToAppear('.modal-dialog');

    assert.dom('.modal-title').hasText(
      'Warning!!!!',
      'Inventory Item with negative quantity should not be saved.'
    );

    await click('button:contains(Ok)');
    assert.equal(currentURL(), '/inventory/edit/new');
    findWithAssert('button:contains(Add)');
    findWithAssert('button:contains(Cancel)');
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

    await click('a:contains(Barcode)');
    assert.equal(currentURL(), '/inventory/barcode/igbmk5zf_is');
    findWithAssert('.panel-body img[src^="data:image"]');
  });
});

test('Deleting the last inventory item', (assert) => {
  return runWithPouchDump('inventory', async function() {
    await authenticateUser();
    await visit('/inventory/listing');
    assert.equal(currentURL(), '/inventory/listing');

    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Item', 'Deleting confirmation.');

    await click('.modal-content button:contains(Delete)');
    await waitToAppear('.panel-body .alert-info');
    assert.equal(currentURL(), '/inventory/listing');
    findWithAssert('a:contains(Create a new record?)');
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
    await click('button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Request Updated', 'New request has been saved');

    await click('button:contains(Ok)');
    findWithAssert('button:contains(Fulfill)');
    findWithAssert('button:contains(Cancel)');

    await click('button:contains(Cancel)');
    assert.equal(currentURL(), '/inventory');
    assert.dom('tr').exists({ count: 3 }, 'Two requests are now displayed');
  });
});

test('Fulfilling an inventory request', function(assert) {
  return runWithPouchDump('inventory', async function() {
    await authenticateUser();
    await visit('/inventory');
    assert.equal(currentURL(), '/inventory');
    let tableRows = find('tr').length;
    assert.equal(tableRows, 2, 'One request not fulfilled');

    await click('button:contains(Fulfill)');
    findWithAssert('button:contains(Fulfill)');
    findWithAssert('button:contains(Cancel)');

    await waitToAppear('.inventory-location option:contains(No Location)');
    await click('button:contains(Fulfill)');
    await waitToAppear('.modal-dialog');

    let modalTitle = find('.modal-title');
    assert.equal(modalTitle.text(), 'Request Fulfilled', 'Inventory request has been fulfilled');

    await click('button:contains(Ok)');
    assert.equal(currentURL(), '/inventory');
  });
});

test('Deleting an inventory request', function(assert) {
  return runWithPouchDump('inventory', async function() {
    await authenticateUser();
    await visit('/inventory');
    assert.equal(currentURL(), '/inventory', 'Navigated to /inventory');
    assert.equal(find('button:contains(Delete)').length, 1, 'There is one request');

    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Item', 'Deleting confirmation');

    await click('.modal-content button:contains(Delete)');
    await waitToAppear('.panel-body .alert-info');
    assert.equal(currentURL(), '/inventory', 'Navigated to /inventory');
    assert.equal(find('button:contains(Delete)').length, 0, 'Request was deleted');
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
    assert.equal(find('button:contains(Delete)').length, 0, 'User doesn\'t see Delete button');
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
    await click('button:contains(Save)');
    await waitToAppear('.modal-title');

    let modalTitle = find('.modal-title');
    assert.equal(modalTitle.text(), 'Inventory Purchases Saved', 'Inventory has been received');

    await click('button:contains(Ok)');
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
    assert.equal(find('button:contains(Delete)').length, 1, 'There is one search item');

    await fillIn('[role="search"] div input', 'biogesic');
    await click('.glyphicon-search');
    assert.equal(currentURL(), '/inventory/search/biogesic', 'Searched with all lower case ');
    assert.equal(find('button:contains(Delete)').length, 1, 'There is one search item');

    await fillIn('[role="search"] div input', 'ItemNotFound');
    await click('.glyphicon-search');
    assert.equal(currentURL(), '/inventory/search/ItemNotFound', 'Searched for ItemNotFound');
    assert.equal(find('button:contains(Delete)').length, 0, 'There is no search result');
  });
});

const startAndEndDateReportTypes = [
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

const singleDateReportTypes = [
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
      await click('button:contains(Generate Report)');
      await waitToAppear('.panel-title');
      let reportTitle = `${reportName} Report ${startDate.format('l')} - ${endDate.format('l')}`;
      assert.dom('.panel-title').hasText(reportTitle, `${reportName} Report generated`);
      let exportLink = findWithAssert('a:contains(Export Report)');
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
  await click('button:contains(Generate Report)');
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
      let exportLink = findWithAssert('a:contains(Export Report)');
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
      let exportLink = findWithAssert('a:contains(Export Report)');
      assert.equal($(exportLink).attr('download'), `${reportTitle}.csv`);
    });
  });
}
