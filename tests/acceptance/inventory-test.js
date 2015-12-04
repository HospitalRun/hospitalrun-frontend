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
  runWithPouchDump('default', function() {
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
  });
});

test('Adding a new inventory item', (assert) => {
  runWithPouchDump('default', function() {
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
  });
});

test('Creating a new inventory request', function(assert) {
  runWithPouchDump('inventory', function() {
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
  });
});

test('Fulfilling an inventory request', function(assert) {
  runWithPouchDump('inventory', function() {
    authenticateUser();
    visit('/inventory');

    andThen(function() {
      assert.equal(currentURL(), '/inventory');
      let tableRows = find('tr').length;
      assert.equal(tableRows, 2, 'One request not fulfilled');
    });
    click('button:contains(Fulfill)');

    andThen(() => {
      findWithAssert('button:contains(Fulfill)');
      findWithAssert('button:contains(Cancel)');
    });

    click('button:contains(Fulfill)');
    waitToAppear('.modal-dialog');

    andThen(() => {
      let modalTitle = find('.modal-title');
      assert.equal(modalTitle.text(), 'Request Fulfilled', 'Inventory request has been fulfilled');
    });

    click('button:contains(Ok)');
    andThen(() => {
      assert.equal(currentURL(), '/inventory');
    });
  });
});

test('Receiving inventory', function(assert) {
  runWithPouchDump('inventory', function() {
    authenticateUser();
    visit('/inventory/batch/new');

    andThen(function() {
      assert.equal(currentURL(), '/inventory/batch/new');
    });
    fillIn('.test-vendor .tt-input', 'Alpha Pharmacy');
    triggerEvent('.test-vendor .tt-input', 'input');
    triggerEvent('.test-vendor .tt-input', 'blur');
    fillIn('.test-invoice-number input', 'P2345');
    fillIn('.test-inv-item .tt-input', 'Biogesic - m00001');
    triggerEvent('.test-inv-item .tt-input', 'input');
    triggerEvent('.test-inv-item .tt-input', 'blur');
    keyEvent('.test-inv-item .tt-input', 'keypress', 9);
    fillIn('.test-inv-quantity input', 500);
    fillIn('.test-inv-cost input', '2000');
    click('button:contains(Save)');
    waitToAppear('.modal-title');

    andThen(() => {
      let modalTitle = find('.modal-title');
      assert.equal(modalTitle.text(), 'Inventory Purchases Saved', 'Inventory has been received');
    });
    click('button:contains(Ok)');

    andThen(() => {
      assert.equal(currentURL(), '/inventory/listing');
    });
  });
});

testSimpleReportForm('Detailed Adjustment');
testSimpleReportForm('Detailed Purchase');
testSimpleReportForm('Detailed Stock Usage');
testSimpleReportForm('Detailed Stock Transfer');
testSimpleReportForm('Detailed Expenses');
testSimpleReportForm('Expiration Date');
testSimpleReportForm('Summary Expenses');
testSimpleReportForm('Summary Purchase');
testSimpleReportForm('Summary Stock Usage');
testSimpleReportForm('Summary Stock Transfer');
testSimpleReportForm('Finance Summary');
testSingleDateReportForm('Inventory By Location');
testSingleDateReportForm('Inventory Valuation');

function testSimpleReportForm(reportName) {
  test(`${reportName} report can be generated`, function(assert) {
    runWithPouchDump('default', function() {
      authenticateUser();
      visit('/inventory/reports');
      andThen(function() {
        assert.equal(currentURL(), '/inventory/reports');
      });
      var startDate = moment('2015-10-01');
      var endDate = moment('2015-10-31');
      selectDate('.test-start-date input', startDate.toDate());
      selectDate('.test-end-date input', endDate.toDate());
      select('#report-type', `${reportName}`);
      click('button:contains(Generate Report)');
      waitToAppear('.panel-title');

      andThen(() => {
        var reportTitle = `${reportName} Report ${startDate.format('l')} - ${endDate.format('l')}`;
        assert.equal(find('.panel-title').text().trim(), reportTitle, `${reportName} Report generated`);
        findWithAssert('a:contains(Export Report)');
      });
    });
  });
}

function testSingleDateReportForm(reportName) {
  test(`${reportName} report can be generated`, function(assert) {
    runWithPouchDump('default', function() {
      authenticateUser();
      visit('/inventory/reports');
      andThen(function() {
        assert.equal(currentURL(), '/inventory/reports');
      });
      select('#report-type', `${reportName}`);
      click('button:contains(Generate Report)');
      waitToAppear('.panel-title');

      andThen(() => {
        assert.equal(find('.panel-title').text().trim(), `${reportName} Report ${moment().format('l')}`, `${reportName} Report generated`);
        findWithAssert('a:contains(Export Report)');
      });
    });
  });
}
