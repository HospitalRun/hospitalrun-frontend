import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | visits', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Add visit', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients', 'Patient url is correct');
      click('button:contains(Edit)');
    });
    andThen(function() {
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
      click('[data-test-selector=visits-tab]');
      waitToAppear('#visits button:contains(Edit)'); // Make sure visits have been retrieved.
    });
    andThen(function() {
      click('#visits button:contains(New Visit)');
      waitToAppear('#visit-info');
    });
    andThen(function() {
      assert.equal(find('.patient-name').text(), 'Joe Bagadonuts', 'Joe Bagadonuts displays as patient for visit');
      updateVisit(assert, 'Add');
    });
  });
});

test('Edit visit', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients', 'Patient url is correct');
      click('button:contains(Edit)');
    });
    andThen(function() {
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
      click('[data-test-selector=visits-tab]');
      waitToAppear('#visits button:contains(Edit)');
    });
    andThen(function() {
      click('#visits button:contains(Edit)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/visits/edit/03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'Visit url is correct');
      click('button:contains(Add Diagnosis)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Add Diagnosis', 'Add Diagnosis dialog displays');
      fillIn('.diagnosis-text input', 'Broken Arm');
      click('.modal-footer button:contains(Add)');
    });
    andThen(function() {
      assert.equal(find('.additional-diagnoses-text').text(), 'Broken Arm', 'New additional diagnosis appears');
      click('button:contains(New Medication)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/medication/edit/new', 'New medication url is correct');
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'New medication prepopulates with patient');
      click('button:contains(Cancel)');
    });
    andThen(function() {
      click('button:contains(New Lab)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/labs/edit/new', 'New lab url is correct');
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'New lab prepopulates with patient');
      click('button:contains(Cancel)');
    });
    andThen(function() {
      click('button:contains(New Imaging)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/imaging/edit/new', 'New imaging url is correct');
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'New imaging prepopulates with patient');
      click('button:contains(Cancel)');
    });
    andThen(function() {
      click('button:contains(New Vitals)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      fillIn('.temperature-text input', '34.56');
      fillIn('.weight-text input', '34.56');
      fillIn('.height-text input', '34.56');
      fillIn('.sbp-text input', '34.56');
      fillIn('.dbp-text input', '34.56');
      fillIn('.heart-rate-text input', '34.56');
      fillIn('.respiratory-rate-text input', '34.56');
      click('.modal-footer button:contains(Add)');
      waitToAppear('#visit-vitals tr:last td:contains(34.56)');
    });
    andThen(function() {
      assert.equal(find('#visit-vitals tr:last td:contains(34.56)').length, 7, 'New vitals appears');
      click('button:contains(Add Item)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      typeAheadFillIn('.charge-item-name', 'Gauze pad');
      click('.modal-footer button:contains(Add)');
      waitToAppear('td.charge-item-name');
    });
    andThen(function() {
      assert.equal(find('td.charge-item-name').text(), 'Gauze pad', 'New charge item appears');
    });
    updateVisit(assert, 'Update');
    andThen(function() {
      click('.delete-additional-diagnosis');
    });
    andThen(function() {
      click('#visit-vitals tr:last button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Delete Vitals', 'Delete Vitals dialog displays');
      click('.modal-footer button:contains(Delete)');
    });
    andThen(function() {
      click('.charge-items tr:last button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Delete Charge Item', 'Delete Charge Item dialog displays');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(function() {
      assert.equal(find('.additional-diagnoses-text').length, 0, 'New additional diagnosis is deleted');
      assert.equal(find('#visit-vitals tr:last td:contains(34.56)').length, 0, 'Vital is deleted');
      assert.equal(find('td.charge-item-name').length, 0, 'Charge item is deleted');
    });
  });
});

test('Delete visit', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients', 'Patient url is correct');
      click('button:contains(Edit)');
    });
    andThen(function() {
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
      click('[data-test-selector=visits-tab]');
      waitToAppear('#visits button:contains(Delete)'); // Make sure visits have been retrieved.
    });
    andThen(function() {
      assert.equal(find('#visits tr').length, 2, 'One visit is displayed to delete');
      click('#visits button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Delete Visit', 'Delete Visit confirmation displays');
      click('.modal-footer button:contains(Delete)');
      waitToDisappear('#visits td:contains(Fall from in-line roller-skates, initial encounter)');
    });
    andThen(function() {
      assert.equal(find('#visits tr').length, 1, 'Visit is deleted');
    });
  });
});

function updateVisit(assert, buttonText) {
  andThen(function() {
    click(`.panel-footer button:contains(${buttonText})`);
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Visit Saved', 'Visit Saved dialog displays');
    click('button:contains(Ok)');
  });
}
