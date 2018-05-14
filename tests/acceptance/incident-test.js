import moment from 'moment';
import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';

const DATE_FORMAT = 'l';
const DATE_TIME_FORMAT = 'l h:mm A';
const DEPARTMENT = 'Pharmacy';
const INCIDENT_CATEGORY = 'Patient Falls';
const INCIDENT_CATEGORY_ITEM = 'Ambulating';
const INCIDENT_DESCRIPTION = 'Patient fell on wet floor that was recently mopped.';
const INCIDENT_NOTES = 'Additional Notes here';
const EDIT_INCIDENT_NOTE = 'The wet floor sign had fallen down and was no longer visible.';
const REPORTED_TO = 'Jack Bridges';

moduleForAcceptance('Acceptance | Incidents');

test('Incident category management', function(assert) {
  return runWithPouchDump('incident', async function() {
    await authenticateUser();
    await visit('/admin/inc-category');
    assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');

    await click('button:contains(+ new category)');
    assert.equal(currentURL(), '/admin/inc-category/edit/new', 'New incident category URL is correct');

    await fillIn('.incident-category-name input', 'Infection Control');
    await addItem(assert, 'Surgical Site Infection');
    await addItem(assert, 'Hospital Acquired Infection');
    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Item', 'Delete Item modal appears');

    await click('.modal-footer button:contains(Ok)');
    await waitToDisappear('.modal-dialog');
    assert.equal(find('.incident-category-item:contains(Surgical Site Infection)').length,
      0, 'Deleted incident category item disappears');
    await click('.panel-footer button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Incident Category Saved', 'Incident Category saved modal appears');
    await click('button:contains(Return)');
    assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');
    assert.equal(find('td.incident-catergory-name:contains(Infection Control)').length,
      1, 'New incident category displays in listing');
  });
});

test('Incident creation and editing', function(assert) {
  return runWithPouchDump('incident', async function() {
    let now = moment();
    await authenticateUser();
    await visit('/incident');
    assert.equal(currentURL(), '/incident', 'Incident listing url is correct');

    await click('button:contains(+ new incident)');
    assert.equal(currentURL(), '/incident/edit/new', 'Incident edit url is correct');

    await click('.sentinel-event input');
    await fillIn('.incident-date input', now.format(DATE_TIME_FORMAT));
    await typeAheadFillIn('.incident-department', DEPARTMENT);
    await fillIn('.reported-to input', REPORTED_TO);
    await fillIn('.incident-category select', INCIDENT_CATEGORY);
    await waitToAppear(`.incident-category-item option:contains(${INCIDENT_CATEGORY_ITEM})`);
    await select('.incident-category-item', INCIDENT_CATEGORY_ITEM);
    await typeAheadFillIn('.patient-name', 'Joe Bagadonuts - P00001');
    await waitToAppear('.patient-id:contains(P00001)');
    assert.dom('.patient-id').hasText('P00001', 'Selected patient id appears');

    await fillIn('.incident-description textarea', 'Patient blacked out and fell down.');
    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');

    await click('.modal-footer button:contains(Ok)');
    assert.equal(find('.tab-nav li a:contains(Notes)').length, 1, 'Notes tab appears');
    assert.equal(find('.tab-nav li a:contains(Attachment)').length, 1, 'Attachment tab appears');
    assert.equal(find('.tab-nav li a:contains(Harm Score)').length, 1, 'Harm Score custom form tab appears');
    assert.equal(find('.tab-nav li a:contains(+ Add Form)').length, 1, 'Add Custom form tab appears');

    await click('button:contains(+ New Note)');
    await waitToAppear('.modal-dialog');
    await fillIn('.note-description textarea', INCIDENT_NOTES);
    await click('.modal-footer button:contains(Add)');
    await waitToDisappear('.modal-dialog');
    await waitToAppear(`.note-description:contains(${INCIDENT_NOTES})`);
    assert.equal(find(`.note-description:contains(${INCIDENT_NOTES})`).length, 1, 'Added note appears in listing');

    await click('.tab-nav li a:contains(Attachment)');
    await click('button:contains(+ New Attachment)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Add Attachment', 'Add attachment dialog appears');

    // Right now we don't have a good way to test adding attachments.
    await click('.modal-footer button:contains(Cancel)');
    await waitToDisappear('.modal-dialog');
    await click('.tab-nav li a:contains(Harm Score)');
    assert.equal(find('#customForm0 label:contains(No Actual Event)').length, 1, 'Always add custom form renders');

    await click('.tab-nav li a:contains(+ Add Form)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Add Custom Form', 'Add custom form dialog appears');

    await select('.form-to-add', 'Incident');
    await click('.modal-footer button:contains(Add Form)');
    await waitToDisappear('.modal-dialog');
    assert.equal(find('.tab-nav li a:contains(Pre-Incident Risk Assessment)').length, 1, 'Pre-Incident Risk Assessment form tab now appears');
    assert.equal(find('.tab-nav li a:contains(+ Add Form)').length, 0, 'Add Custom form tab disappears');

    await click('.tab-nav li a:contains(Pre-Incident Risk Assessment)');
    assert.equal(find('#customForm1 label:contains(Minimum No injuries, low financial loss)').length, 1, 'Pre-Incident Risk Assessment custom form renders');

    await click('.panel-footer button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');

    await click('.modal-footer button:contains(Ok)');
    await waitToDisappear('.modal-dialog');
    await click('.panel-footer button:contains(Return)');
    assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
    assert.equal(find('.incident-row').length, 2, 'Two incidents appears');
    assert.equal(find(`.incident-row td.incident-date:contains(${now.format(DATE_FORMAT)})`).length, 1, 'Incident date appears in listing');
    assert.equal(find(`.incident-row td.incident-department:contains(${DEPARTMENT})`).length, 1, 'Incident department appears in listing');
    assert.equal(find(`.incident-row td.incident-category:contains(${INCIDENT_CATEGORY})`).length, 1, 'Incident category appears in listing');
    assert.equal(find(`.incident-row td.incident-category-item:contains(${INCIDENT_CATEGORY_ITEM})`).length, 1, 'Incident category item appears in listing');
    assert.equal(find('.incident-row td.incident-status:last').text(), 'Reported', 'Incident status of reported appears in listing');

    await visit('/incident/edit/56c64d71-ba30-4271-b899-f6f6b031f589');

    let incidentDate = moment(1489004400000);
    assert.equal(currentURL(), '/incident/edit/56c64d71-ba30-4271-b899-f6f6b031f589', 'Incident edit url is correct');
    assert.dom('.sentinel-event input').isChecked('Sentinel Event checkbox is checked');
    assert.dom('.incident-date input').hasValue(incidentDate.format(DATE_TIME_FORMAT), 'Date of incident displays');
    assert.dom('.incident-department .tt-input').hasValue('Reception', 'Incident department displays');
    assert.dom('.reported-to input').hasValue('Jane Bagadonuts', 'Reported to displays.');
    assert.equal(find('.incident-category option:selected').text().trim(), 'Accident or Injury', 'Category displays');
    assert.equal(find('.incident-category-item option:selected').text().trim(), 'Patient', 'Category item displays');
    assert.dom('.patient-name .tt-input').hasValue('Joe Bagadonuts - P00001', 'Patient impacted name displays');
    assert.dom('.patient-id').hasText('P00001', 'Patient id displays');
    assert.dom('.incident-description textarea').hasValue('Patient fell on wet floor.', 'Description displays');

    await fillIn('.incident-description textarea', INCIDENT_DESCRIPTION);
    assert.dom('.incident-description textarea').hasValue(INCIDENT_DESCRIPTION, 'Updated description displays');

    await click('.panel-footer button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');

    await click('.modal-footer button:contains(Ok)');
    await waitToDisappear('.modal-dialog');
    await click('#notes tr button:contains(Edit)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Edit Note', ' Edit Note modal appears');

    await fillIn('.note-description textarea', EDIT_INCIDENT_NOTE);
    await click('.modal-footer button:contains(Update)');
    await waitToDisappear('.modal-dialog');
    assert.dom('.note-description').hasText(EDIT_INCIDENT_NOTE, 'Note is updated');

    await click('#notes tr button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Note', ' Delete Note modal appears');

    await click('.modal-footer button:contains(Delete)');
    await waitToDisappear('.modal-dialog');
    assert.dom('.note-description').doesNotExist('Note has been deleted');

    await click('.tab-nav li a:contains(Attachment)');
    await waitToAppear('#attachments td a:contains(Download)');
    assert.equal(find('#attachments td a:contains(Download)').length, 1, 'Download button appears for attachment');

    await click('#attachments td button:contains(Edit)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Edit Attachment', ' Edit Attachment modal appears');

    await fillIn('.attachment-title input', 'Incident Report Form');
    await click('.modal-footer button:contains(Update)');
    await waitToDisappear('.modal-dialog');
    assert.equal(find('#attachments td:contains(Incident Report Form)').length, 1, 'Updated attachment title appears');

    await click('#attachments td button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Attachment', ' Delete Attachment modal appears');

    await click('.modal-footer button:contains(Ok)');
    assert.equal(find('#attachments td:contains(Incident Report Form)').length, 0, 'Deleted attachment disappears');
  });
});

test('Incident deletion', function(assert) {
  return runWithPouchDump('incident', async function() {
    await authenticateUser();
    await visit('/incident');
    assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
    assert.dom('.incident-row').exists({ count: 1 }, 'One incident appears');

    await click('.incident-row button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Incident', ' Delete Incident modal appears');

    await click('.modal-footer button:contains(Delete)');
    await waitToDisappear('.modal-dialog');
    assert.dom('.incident-row').doesNotExist('Incident diappears from list');
  });
});

async function addItem(assert, itemName) {
  await click('button:contains(Add Item)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Add Category Item', 'Add Category Item modal appears');

  await fillIn('.incident-category-item input', itemName);
  await click('.modal-footer button:contains(Add)');
  await waitToAppear(`.incident-category-item:contains(${itemName})`);
  assert.equal(find(`.incident-category-item:contains(${itemName})`).length,
    1, 'New incident category item appears');
}
