import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear, waitToDisappear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | procedures');

testWithVisit('Add procedure', async function(assert) {
  let procedureDesc = 'Release Left Elbow Bursa and Ligament, Percutaneous Approach';
  assert.dom('#visit-procedures tr').exists({ count: 2 }, 'One procedure is listed for the visit');

  await click('button:contains(New Procedure)');
  await typeAheadFillIn('.procedure-description', procedureDesc);
  await typeAheadFillIn('.procedure-physician', 'Dr Jones');
  await updateProcedure(assert, 'Add');
  await click('button:contains(Return)');
  assert.equal(find('#visit-procedures tr').length, 3, 'Two procedure are listed for the visit');
  assert.equal(find(`#visit-procedures td:contains(${procedureDesc})`).length, 1, 'New procedure description is listed for the visit');
});

testWithVisit('Edit procedure', async function(assert) {
  await click('#visit-procedures button:contains(Edit)');
  assert.equal(currentURL(), '/visits/procedures/edit/398B4F58-152F-1476-8ED1-329C4D85E25F', 'Procedure url is correct');

  await fillIn('.procedure-notes', 'Abdominals blood glucose level blood pressure carbohydrate medications');
  await click('button:contains(Add Item)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Add Charge Item', 'Add Charge Item modal appears');

  await typeAheadFillIn('.charge-item-name', 'Gauze pad');
  await click('.modal-footer button:contains(Add)');
  await waitToDisappear('.modal-dialog');
  await waitToAppear('td.charge-item-name:contains(Gauze pad)');
  assert.equal(find('td.charge-item-name:contains(Gauze pad)').length, 1, 'New charge item appears');

  await click('.charge-items tr:last button:contains(Edit)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Edit Charge Item', 'Edit Charge Item modal appears');

  await typeAheadFillIn('.charge-item-name', 'Gauze padding');
  await click('.modal-footer button:contains(Update)');
  await waitToAppear('td.charge-item-name:contains(Gauze padding)');
  await waitToDisappear('.modal-dialog');
  assert.equal(find('td.charge-item-name:contains(Gauze padding)').length, 1, 'Updated charge item appears');
  assert.dom('.medication-charges tr').exists({ count: 2 }, 'One medication charge exists');
  assert.equal(find('.medication-charges button:contains(Add Medication)').length, 1, 'Add medication button exists');

  await click('button:contains(Add Medication)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Add Medication Used', 'Add Medication Used modal appears');

  await typeAheadFillIn('.medication-used', 'Cefazolin 500mg vial (Hazolin) - m00001 (999998 available)');
  await waitToDisappear('.disabled-btn:contains(Add)');
  await click('.modal-footer button:contains(Add)');
  await waitToDisappear('.modal-dialog');
  await updateProcedure(assert, 'Update');
  assert.equal(find('.medication-charges td:contains(Cefazolin 500mg vial)').length, 2, 'Two medication charges exists');

  await click('.medication-charges button:contains(Edit):first');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Edit Medication Used', 'Edit Medication Used modal appears here');

  await fillIn('.medication-quantity input', 2);
  await click('.modal-footer button:contains(Update)');
  await waitToDisappear('.modal-dialog');
  await waitToAppear('.medication-charge-quantity:contains(2)');
  assert.equal(find('.medication-charge-quantity:first').text(), '2', 'Updated medication quantity appears');

  await updateProcedure(assert, 'Update');
  await click('.charge-items tr:last button:contains(Delete)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Delete Charge Item', 'Delete Charge Item dialog displays');

  await click('.modal-footer button:contains(Ok)');
  await waitToDisappear('.modal-dialog');
  await waitToDisappear('.charge-items tr:last button:contains(Delete)');
  await click('.medication-charges tr:last button:contains(Delete)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Delete Medication Used', 'Delete Medication Used dialog displays');

  await click('.modal-footer button:contains(Ok)');
  await waitToDisappear('.modal-dialog');
  await updateProcedure(assert, 'Update');
  await waitToAppear('button:contains(Return)');
  await click('button:contains(Return)');
  await click('#visit-procedures button:contains(Edit)');
  assert.equal(currentURL(), '/visits/procedures/edit/398B4F58-152F-1476-8ED1-329C4D85E25F', 'Returned back to procedure');
  assert.dom('td.charge-item-name').doesNotExist('Charge item is deleted');
  assert.dom('.medication-charges tr').exists({ count: 2 }, 'Medication used is deleted');
});

testWithVisit('Delete procedure', async function(assert) {
  assert.dom('#visit-procedures tr').exists({ count: 2 }, 'One procedure is displayed to delete');

  await click('#visit-procedures button:contains(Delete)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Delete Procedure', 'Delete Procedure confirmation displays');

  await click('.modal-footer button:contains(Delete)');
  await waitToDisappear('.modal-dialog');
  assert.dom('#visit-procedures tr').exists({ count: 1 }, 'Procedure is deleted');
});

function testWithVisit(testLabel, testFunction) {
  test(testLabel, function(assert) {
    return runWithPouchDump('patient', async function() {
      await authenticateUser();
      await visit('/patients');
      assert.equal(currentURL(), '/patients', 'Patient url is correct');

      await click('button:contains(Edit)');
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient record displays');

      await click('[data-test-selector=visits-tab]');
      await waitToAppear('#visits button:contains(Edit)');
      await click('#visits button:contains(Edit)');
      assert.equal(currentURL(), '/visits/edit/03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'Visit url is correct');

      await testFunction(assert);
    });
  });
}

async function updateProcedure(assert, buttonText) {
  await click(`.panel-footer button:contains(${buttonText})`);
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Procedure Saved', 'Procedure Saved dialog displays');

  await click('button:contains(Ok)');
}
