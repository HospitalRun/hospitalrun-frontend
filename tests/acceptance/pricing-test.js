import {
  click,
  fillIn,
  find,
  findAll,
  currentURL,
  visit,
  waitUntil
} from "@ember/test-helpers";
import { findWithAssert } from "ember-native-dom-helpers";
import { module, test } from 'qunit';
import {
  default as jquerySelect,
  jqueryLength
} from "hospitalrun/tests/helpers/jquery-select";
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import { waitToAppear, waitToDisappear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

function verifyPricingLists(path, includesPrices, excludesPrices, assert) {
  return runWithPouchDump('billing', async function() {
    await authenticateUser();
    await visit(path);
    assert.equal(currentURL(), path);
    includesPrices.forEach(function(priceName) {
      assert.equal(jqueryLength(`.price-name:contains(${priceName})`), 1, `${priceName} displays`);
    });
    excludesPrices.forEach(function(priceName) {
      assert.equal(jqueryLength(`.price-name:contains(${priceName})`), 0, `${priceName} is not present`);
    });
  });
}

module('Acceptance | pricing', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /pricing', function(assert) {
    let includesPrices = [
      'Xray Hand',
      'Blood test',
      'Leg Casting',
      'Gauze pad'
    ];
    return verifyPricingLists('/pricing', includesPrices, [], assert);
  });

  test('visiting /pricing/imaging', function(assert) {
    let excludesPrices = [
      'Blood test',
      'Leg Casting',
      'Gauze pad'
    ];
    let includesPrices = [
      'Xray Hand'
    ];
    return verifyPricingLists('/pricing/imaging', includesPrices, excludesPrices, assert);

  });

  test('visiting /pricing/lab', function(assert) {
    let excludesPrices = [
      'Xray Hand',
      'Leg Casting',
      'Gauze pad'
    ];
    let includesPrices = [
      'Blood test'
    ];
    return verifyPricingLists('/pricing/lab', includesPrices, excludesPrices, assert);
  });

  test('visiting /pricing/procedure', function(assert) {
    let excludesPrices = [
      'Xray Hand',
      'Blood test',
      'Gauze pad'
    ];
    let includesPrices = [
      'Leg Casting'
    ];
    return verifyPricingLists('/pricing/procedure', includesPrices, excludesPrices, assert);
  });

  test('visiting /pricing/ward', function(assert) {
    let excludesPrices = [
      'Xray Hand',
      'Blood test',
      'Leg Casting'
    ];
    let includesPrices = [
      'Gauze pad'
    ];
    return verifyPricingLists('/pricing/ward', includesPrices, excludesPrices, assert);
  });

  test('create new price', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/pricing');
      await click(jquerySelect('button:contains(+ new item)'));
      assert.equal(currentURL(), '/pricing/edit/new');

      await fillIn('.price-name input', 'Xray Foot');
      await fillIn('.price-amount input', 100);
      await fillIn('.price-department input', 'Imaging');
      await select('.price-category', 'Imaging');
      await click(jquerySelect('button:contains(Add):last'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Pricing Item Saved', 'Pricing Item saved');

      await click(jquerySelect('button:contains(Ok)'));
      await click(jquerySelect('button:contains(Add Override)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Add Override', 'Add Override Dialog displays');

      await select('.pricing-profile', 'Half off');
      await fillIn('.pricing-override-price input', 20);
      await click(jquerySelect('button:contains(Add):last'));
      await waitToAppear('.override-profile');
      assert.dom('.override-profile').hasText('Half off', 'Pricing override saved');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('button:contains(Ok)'));
      assert.dom('.override-profile').doesNotExist('Pricing override deleted');
    });
  });

  test('verify behavior of Category control and Pricing Type field', function(assert) {
    return runWithPouchDump('default', async function() {

      // go to /pricing/lab, add item and confirm Pricing Type is 'Lab Procedure' (bug fixed in PR #1526)
      await authenticateUser();
      await visit('/pricing/lab');
      await click(jquerySelect('button:contains(+ new item)'));
      assert.equal(currentURL(), '/pricing/edit/newLab');
      await fillIn('.price-name input', 'Test Lab Item');
      await fillIn('.price-amount input', 10);
      await fillIn('.price-department input', 'Test Expense Acct');
      await click(jquerySelect('button:contains(Add):last'));

      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Pricing Item Saved', 'Pricing Item saved');
      await click(jquerySelect('button:contains(Return)'));

      await waitUntil(() => currentURL() === "/pricing");

      assert.dom('td:nth-child(4)').hasText('Lab Procedure');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('button:contains(Delete):last'));

      // test that changing Category sets proper Pricing Type depending on which Category selected
      await visit('/pricing/ward');
      await click(jquerySelect('button:contains(+ new item)'));
      assert.equal(currentURL(), '/pricing/edit/newWard');

      await fillIn('.price-name input', 'Test Ward Item');
      await fillIn('.price-amount input', 10);
      await fillIn('.price-department input', 'Test Expense Acct');

      await fillIn('.price-type input', 'fake price type');
      await select('.price-category', 'Procedure');
      assert.dom('.price-type input').hasText('', 'Changing Category to "Procedure" sets Pricing Type to ""');

      await select('.price-category', 'Imaging');
      await click(jquerySelect('button:contains(Add):last'));

      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Pricing Item Saved', 'Pricing Item saved');
      await click(jquerySelect('button:contains(Return)'));

      await waitUntil(() => currentURL() === "/pricing");

      assert.dom('td:nth-child(4)').hasText('Imaging Procedure');
    });
  });

  test('delete price', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/pricing/lab');
      assert.equal(currentURL(), '/pricing/lab');
      assert.equal(jqueryLength('.price-name:contains(Blood test)'), 1, 'Price exists to delete');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.alert').hasText(
        'Are you sure you wish to delete Blood test?',
        'Pricing item is displayed for deletion'
      );

      await click(jquerySelect('button:contains(Delete):last'));
      await waitToDisappear('.price-name:contains(Blood test)');
      assert.equal(jqueryLength('.price-name:contains(Blood test)'), 0, 'Price disappears from price list');
    });
  });

  test('create new pricing profile', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/pricing/profiles');
      assert.equal(currentURL(), '/pricing/profiles');

      await click(jquerySelect('button:contains(+ new item)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('New Pricing Profile', 'New Pricing Profile modal appears');

      await fillIn('.pricing-profile-name input', 'Quarter Off');
      await fillIn('.pricing-profile-percentage input', 25);
      await fillIn('.pricing-profile-discount input', 10);
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('.modal-title:contains(Pricing Profile Saved)');
      await click(jquerySelect('button:contains(Ok)'));
      await waitToAppear('.pricing-profile-name:contains(Quarter Off)');

      assert.equal(
        jquerySelect('.pricing-profile-name:contains(Quarter Off)').textContent.trim(),
        'Quarter Off',
        'New price profile displays'
      );
    });
  });

  test('delete pricing profile', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/pricing/profiles');
      assert.equal(currentURL(), '/pricing/profiles');
      assert.equal(jqueryLength('.pricing-profile-name:contains(Half off)'), 1, 'Pricing profile exists to delete');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Profile', 'Pricing Profile delete confirmation is displayed');

      await click(jquerySelect('button:contains(Ok)'));
      await waitToDisappear('.pricing-profile-name:contains(Half off)');
      assert.equal(jqueryLength('.pricing-profile-name:contains(Half off)'), 0, 'Pricing profile disappears from list');
    });
  });

  test('Searching pricing', function(assert) {
    return runWithPouchDump('billing', async function() {
      await authenticateUser();
      await visit('/pricing');

      await fillIn('[role="search"] div input', 'Xray Hand');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/Xray%20Hand', 'Searched for Name: Xray Hand');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'Blood');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/Blood', 'Searched for Name: Blood');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'Leg');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/Leg', 'Searched for Name: Leg');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'Gauze');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/Gauze', 'Searched for Name: Gauze');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'xray');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/xray', 'Searched for all lower case xray');
      assert.equal(jqueryLength('button:contains(Delete)'), 1, 'There is one search item');

      await fillIn('[role="search"] div input', 'd');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/d', 'Searched for the letter d');
      assert.equal(jqueryLength('button:contains(Delete)'), 3, 'There are three search items');

      await fillIn('[role="search"] div input', 'ItemNotFound');
      await click('.glyphicon-search');
      assert.equal(currentURL(), '/pricing/search/ItemNotFound', 'Searched for ItemNotFound');
      assert.dom('.clickable').doesNotExist('There is no search result');
    });
  });
});
