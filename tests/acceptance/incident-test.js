import moment from 'moment';
import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

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
  runWithPouchDump('incident', function() {
    authenticateUser();
    visit('/admin/inc-category');
    andThen(() => {
      assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');
      click('button:contains(+ new category)');
    });
    andThen(() => {
      assert.equal(currentURL(), '/admin/inc-category/edit/new', 'New incident category URL is correct');
      fillIn('.incident-category-name input', 'Infection Control');
      addItem(assert, 'Surgical Site Infection');
    });
    andThen(() => {
      addItem(assert, 'Hospital Acquired Infection');
    });
    andThen(() => {
      click('button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Delete Item', 'Delete Item modal appears');
      click('.modal-footer button:contains(Ok)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.incident-category-item:contains(Surgical Site Infection)').length,
        0, 'Deleted incident category item disappears');
      click('.panel-footer button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Incident Category Saved', 'Incident Category saved modal appears');
      click('button:contains(Return)');
    });
    andThen(() => {
      assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');
      assert.equal(find('td.incident-catergory-name:contains(Infection Control)').length,
        1, 'New incident category displays in listing');
    });
  });
});

test('Incident creation and editing', function(assert) {
  runWithPouchDump('incident', function() {
    let now = moment();
    authenticateUser();
    visit('/incident');
    andThen(() => {
      assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
      click('button:contains(+ new incident)');
    });
    andThen(() => {
      assert.equal(currentURL(), '/incident/edit/new', 'Incident edit url is correct');
      click('.sentinel-event input');
      fillIn('.incident-date input', now.format(DATE_TIME_FORMAT));
      typeAheadFillIn('.incident-department', DEPARTMENT);
      fillIn('.reported-to input', REPORTED_TO);
      fillIn('.incident-category select', INCIDENT_CATEGORY);
      waitToAppear(`.incident-category-item option:contains(${INCIDENT_CATEGORY_ITEM})`);
    });
    andThen(() => {
      select('.incident-category-item', INCIDENT_CATEGORY_ITEM);
      typeAheadFillIn('.patient-name', 'Joe Bagadonuts - P00001');
      waitToAppear('.patient-id:contains(P00001)');
    });
    andThen(() => {
      assert.dom('.patient-id').hasText('P00001', 'Selected patient id appears');
      fillIn('.incident-description textarea', 'Patient blacked out and fell down.');
    });
    andThen(() => {
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(() => {
      assert.equal(find('.tab-nav li a:contains(Notes)').length, 1, 'Notes tab appears');
      assert.equal(find('.tab-nav li a:contains(Attachment)').length, 1, 'Attachment tab appears');
      assert.equal(find('.tab-nav li a:contains(Harm Score)').length, 1, 'Harm Score custom form tab appears');
      assert.equal(find('.tab-nav li a:contains(+ Add Form)').length, 1, 'Add Custom form tab appears');
      click('button:contains(+ New Note)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      fillIn('.note-description textarea', INCIDENT_NOTES);
      click('.modal-footer button:contains(Add)');
    });
    andThen(() => {
      waitToDisappear('.modal-dialog');
      waitToAppear(`.note-description:contains(${INCIDENT_NOTES})`);
    });
    andThen(() => {
      assert.equal(find(`.note-description:contains(${INCIDENT_NOTES})`).length, 1, 'Added note appears in listing');
      click('.tab-nav li a:contains(Attachment)');
    });
    andThen(() => {
      click('button:contains(+ New Attachment)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Add Attachment', 'Add attachment dialog appears');
      // Right now we don't have a good way to test adding attachments.
      click('.modal-footer button:contains(Cancel)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      click('.tab-nav li a:contains(Harm Score)');
    });
    andThen(() => {
      assert.equal(find('#customForm0 label:contains(No Actual Event)').length, 1, 'Always add custom form renders');
      click('.tab-nav li a:contains(+ Add Form)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Add Custom Form', 'Add custom form dialog appears');
      select('.form-to-add', 'Incident');
    });
    andThen(() => {
      click('.modal-footer button:contains(Add Form)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.tab-nav li a:contains(Pre-Incident Risk Assessment)').length, 1, 'Pre-Incident Risk Assessment form tab now appears');
      assert.equal(find('.tab-nav li a:contains(+ Add Form)').length, 0, 'Add Custom form tab disappears');
      click('.tab-nav li a:contains(Pre-Incident Risk Assessment)');
    });
    andThen(() => {
      assert.equal(find('#customForm1 label:contains(Minimum No injuries, low financial loss)').length, 1, 'Pre-Incident Risk Assessment custom form renders');
      click('.panel-footer button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');
      click('.modal-footer button:contains(Ok)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      click('.panel-footer button:contains(Return)');
    });
    andThen(() => {
      assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
      assert.equal(find('.incident-row').length, 2, 'Two incidents appears');
      assert.equal(find(`.incident-row td.incident-date:contains(${now.format(DATE_FORMAT)})`).length, 1, 'Incident date appears in listing');
      assert.equal(find(`.incident-row td.incident-department:contains(${DEPARTMENT})`).length, 1, 'Incident department appears in listing');
      assert.equal(find(`.incident-row td.incident-category:contains(${INCIDENT_CATEGORY})`).length, 1, 'Incident category appears in listing');
      assert.equal(find(`.incident-row td.incident-category-item:contains(${INCIDENT_CATEGORY_ITEM})`).length, 1, 'Incident category item appears in listing');
      assert.equal(find('.incident-row td.incident-status:last').text(), 'Reported', 'Incident status of reported appears in listing');
      visit('/incident/edit/56c64d71-ba30-4271-b899-f6f6b031f589');
    });
    andThen(() => {
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
      fillIn('.incident-description textarea', INCIDENT_DESCRIPTION);
    });
    andThen(() => {
      assert.dom('.incident-description textarea').hasValue(INCIDENT_DESCRIPTION, 'Updated description displays');
      click('.panel-footer button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');
      click('.modal-footer button:contains(Ok)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      click('#notes tr button:contains(Edit)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Edit Note', ' Edit Note modal appears');
      fillIn('.note-description textarea', EDIT_INCIDENT_NOTE);
    });
    andThen(() => {
      click('.modal-footer button:contains(Update)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.note-description').hasText(EDIT_INCIDENT_NOTE, 'Note is updated');
      click('#notes tr button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Delete Note', ' Delete Note modal appears');
      click('.modal-footer button:contains(Delete)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.note-description').doesNotExist('Note has been deleted');
      click('.tab-nav li a:contains(Attachment)');
      waitToAppear('#attachments td a:contains(Download)');
    });
    andThen(() => {
      assert.equal(find('#attachments td a:contains(Download)').length, 1, 'Download button appears for attachment');
      click('#attachments td button:contains(Edit)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Edit Attachment', ' Edit Attachment modal appears');
      fillIn('.attachment-title input', 'Incident Report Form');
    });
    andThen(() => {
      click('.modal-footer button:contains(Update)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('#attachments td:contains(Incident Report Form)').length, 1, 'Updated attachment title appears');
      click('#attachments td button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Delete Attachment', ' Delete Attachment modal appears');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(() => {
      assert.equal(find('#attachments td:contains(Incident Report Form)').length, 0, 'Deleted attachment disappears');
    });
  });
});

test('Incident deletion', function(assert) {
  runWithPouchDump('incident', function() {
    authenticateUser();
    visit('/incident');
    andThen(() => {
      assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
      assert.dom('.incident-row').exists({ count: 1 }, 'One incident appears');
      click('.incident-row button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Delete Incident', ' Delete Incident modal appears');
      click('.modal-footer button:contains(Delete)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.incident-row').doesNotExist('Incident diappears from list');
    });
  });
});

function addItem(assert, itemName) {
  click('button:contains(Add Item)');
  waitToAppear('.modal-dialog');
  andThen(() => {
    assert.dom('.modal-title').hasText('Add Category Item', 'Add Category Item modal appears');
    fillIn('.incident-category-item input', itemName);
  });
  andThen(() => {
    click('.modal-footer button:contains(Add)');
    waitToAppear(`.incident-category-item:contains(${itemName})`);
  });
  andThen(() => {
    assert.equal(find(`.incident-category-item:contains(${itemName})`).length,
      1, 'New incident category item appears');
  });
}
