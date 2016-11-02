import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | procedures', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

testWithVisit('Add procedure', function(assert) {
  let procedureDesc = 'Release Left Elbow Bursa and Ligament, Percutaneous Approach';
  assert.equal(find('#visit-procedures tr').length, 2, 'One procedure is listed for the visit');
  click('button:contains(New Procedure)');
  andThen(function() {
    typeAheadFillIn('.procedure-description', procedureDesc);
    typeAheadFillIn('.procedure-physician', 'Dr Jones');
    updateProcedure(assert, 'Add');
  });
  andThen(function() {
    click('button:contains(Return)');
  });
  andThen(function() {
    assert.equal(find('#visit-procedures tr').length, 3, 'Two procedure are listed for the visit');
    assert.equal(find(`#visit-procedures td:contains(${procedureDesc})`).length, 1, 'New procedure description is listed for the visit');
  });
});

testWithVisit('Edit procedure', function(assert) {
  click('#visit-procedures button:contains(Edit)');
  andThen(function() {
    assert.equal(currentURL(), '/visits/procedures/edit/398B4F58-152F-1476-8ED1-329C4D85E25F', 'Procedure url is correct');
    fillIn('.procedure-notes', 'Abdominals blood glucose level blood pressure carbohydrate medications');
  });
  andThen(function() {
    click('button:contains(Add Item)');
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Add Charge Item', 'Add Charge Item modal appears');
    typeAheadFillIn('.charge-item-name', 'Gauze pad');
    click('.modal-footer button:contains(Add)');
    waitToAppear('td.charge-item-name');
  });
  andThen(function() {
    assert.equal(find('td.charge-item-name').text(), 'Gauze pad', 'New charge item appears');
    click('.charge-items button:contains(Edit)');
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Edit Charge Item', 'Edit Charge Item modal appears');
    typeAheadFillIn('.charge-item-name', 'Gauze padding');
    click('.modal-footer button:contains(Update)');
    waitToAppear('td.charge-item-name:contains(Gauze padding)');
    waitToDisappear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('td.charge-item-name').text(), 'Gauze padding', 'Updated charge item appears');
    assert.equal(find('.medication-charges tr').length, 2, 'One medication charge exists');
    assert.equal(find('.medication-charges button:contains(Add Medication)').length, 1, 'Add medication button exists');
    click('button:contains(Add Medication)');
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Add Medication Used', 'Add Medication Used modal appears');
    typeAheadFillIn('.medication-used', 'Cefazolin 500mg vial (Hazolin) - m00001 (999998 available)');
    click('.modal-footer button:contains(Add)');
    waitToDisappear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.medication-charges tr').length, 3, 'Two medication charges exists');
    click('.medication-charges button:contains(Edit)');
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Edit Medication Used', 'Edit Medication Used modal appears here');
    fillIn('.medication-quantity input', 2);
    click('.modal-footer button:contains(Update)');
    waitToDisappear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.medication-charge-quantity:first').text(), '2', 'Updated medication quantity appears');
    updateProcedure(assert, 'Update');
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
    click('.medication-charges button:contains(Delete)');
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Delete Medication Used', 'Delete Medication Used dialog displays');
    click('.modal-footer button:contains(Ok)');
  });
  andThen(function() {
    assert.equal(find('td.charge-item-name').length, 0, 'Charge item is deleted');
    assert.equal(find('.medication-charges tr').length, 2, 'Medication used is deleted');
  });
});

testWithVisit('Delete procedure', function(assert) {
  assert.equal(find('#visit-procedures tr').length, 2, 'One procedure is displayed to delete');
  click('#visit-procedures button:contains(Delete)');
  waitToAppear('.modal-dialog');
  andThen(function() {

  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Delete Procedure', 'Delete Procedure confirmation displays');
    click('.modal-footer button:contains(Delete)');
    waitToDisappear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('#visit-procedures tr').length, 1, 'Procedure is deleted');
  });
});

function testWithVisit(testLabel, testFunction) {
  test(testLabel, function(assert) {
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
        testFunction(assert);
      });
    });
  });
}

function updateProcedure(assert, buttonText) {
  andThen(function() {
    click(`.panel-footer button:contains(${buttonText})`);
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Procedure Saved', 'Procedure Saved dialog displays');
    click('button:contains(Ok)');
  });
}
