import { click, fillIn, currentURL, find, visit, waitUntil } from '@ember/test-helpers';
import { findWithAssert } from 'ember-native-dom-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import jqueryLength from 'hospitalrun/tests/helpers/deprecated-jquery-length';
import moment from 'moment';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear, waitToDisappear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';
import selectDate from 'hospitalrun/tests/helpers/select-date';

const DATE_FORMAT = 'l';
const DATE_TIME_FORMAT = 'l h:mm A';
const DEPARTMENT = 'Pharmacy';
const INCIDENT_CATEGORY = 'Patient Falls';
const INCIDENT_CATEGORY_ITEM = 'Ambulating';
const INCIDENT_DESCRIPTION = 'Patient fell on wet floor that was recently mopped.';
const INCIDENT_NOTES = 'Additional Notes here';
const EDIT_INCIDENT_NOTE = 'The wet floor sign had fallen down and was no longer visible.';
const REPORTED_TO = 'Jack Bridges';

module('Acceptance | Incidents', function(hooks) {
  setupApplicationTest(hooks);

  test('Incident category management', function(assert) {
    return runWithPouchDump('incident', async function() {
      await authenticateUser();
      await visit('/admin/inc-category');
      assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');

      await click(jquerySelect('button:contains(+ new category)'));
      assert.equal(currentURL(), '/admin/inc-category/edit/new', 'New incident category URL is correct');

      await fillIn('.incident-category-name input', 'Infection Control');
      await addItem(assert, 'Surgical Site Infection');
      await addItem(assert, 'Hospital Acquired Infection');

      await click(jquerySelect('button:contains(Delete):first'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Item', 'Delete Item modal appears');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');
      assert.equal(jqueryLength('.incident-category-item:contains(Surgical Site Infection)'),
        0, 'Deleted incident category item disappears');
      await click(jquerySelect('.panel-footer button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Incident Category Saved', 'Incident Category saved modal appears');
      await click(jquerySelect('button:contains(Return)'));
      assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');
      assert.equal(jqueryLength('td.incident-catergory-name:contains(Infection Control)'),
        1, 'New incident category displays in listing');
    });
  });

  test('Incident creation and editing', function(assert) {
    return runWithPouchDump('incident', async function() {
      let now = moment();
      await authenticateUser();
      await visit('/incident');
      assert.equal(currentURL(), '/incident', 'Incident listing url is correct');

      await click(jquerySelect('button:contains(+ new incident)'));

      await waitUntil(() => currentURL() === '/incident/edit/new');
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
      await click(jquerySelect('.panel-footer button:contains(Add)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.equal(jqueryLength('.tab-nav li a:contains(Notes)'), 1, 'Notes tab appears');
      assert.equal(jqueryLength('.tab-nav li a:contains(Attachment)'), 1, 'Attachment tab appears');
      assert.equal(jqueryLength('.tab-nav li a:contains(Harm Score)'), 1, 'Harm Score custom form tab appears');
      assert.equal(jqueryLength('.tab-nav li a:contains(+ Add Form)'), 1, 'Add Custom form tab appears');

      await click(jquerySelect('button:contains(+ New Note)'));
      await waitToAppear('.modal-dialog');
      await fillIn('.note-description textarea', INCIDENT_NOTES);
      await click(jquerySelect('.modal-footer button:contains(Add)'));
      await waitToDisappear('.modal-dialog');
      await waitToAppear(jquerySelect(`.note-description:contains(${INCIDENT_NOTES})`));
      assert.equal(jqueryLength(`.note-description:contains(${INCIDENT_NOTES})`), 1, 'Added note appears in listing');

      await click(jquerySelect('.tab-nav li a:contains(Attachment)'));
      await click(jquerySelect('button:contains(+ New Attachment)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Add Attachment', 'Add attachment dialog appears');

      // Right now we don't have a good way to test adding attachments.
      await click(jquerySelect('.modal-footer button:contains(Cancel)'));
      await waitToDisappear('.modal-dialog');
      await click(jquerySelect('.tab-nav li a:contains(Harm Score)'));
      assert.equal(jqueryLength('#customForm0 label:contains(No Actual Event)'), 1, 'Always add custom form renders');

      await click(jquerySelect('.tab-nav li a:contains(+ Add Form)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Add Custom Form', 'Add custom form dialog appears');

      await select('.form-to-add', 'Incident');
      await click(jquerySelect('.modal-footer button:contains(Add Form)'));
      await waitToDisappear('.modal-dialog');
      assert.equal(jqueryLength('.tab-nav li a:contains(Pre-Incident Risk Assessment)'), 1, 'Pre-Incident Risk Assessment form tab now appears');
      assert.equal(jqueryLength('.tab-nav li a:contains(+ Add Form)'), 0, 'Add Custom form tab disappears');

      await click(jquerySelect('.tab-nav li a:contains(Pre-Incident Risk Assessment)'));
      assert.equal(jqueryLength('#customForm1 label:contains(Minimum No injuries, low financial loss)'), 1, 'Pre-Incident Risk Assessment custom form renders');

      await click(jquerySelect('.panel-footer button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');
      await click(jquerySelect('.panel-footer button:contains(Return)'));

      await waitUntil(() => currentURL() === '/incident');
      assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
      assert.equal(jqueryLength('.incident-row'), 2, 'Two incidents appears');
      assert.equal(jqueryLength(`.incident-row td.incident-date:contains(${now.format(DATE_FORMAT)})`), 1, 'Incident date appears in listing');
      assert.equal(jqueryLength(`.incident-row td.incident-department:contains(${DEPARTMENT})`), 1, 'Incident department appears in listing');
      assert.equal(jqueryLength(`.incident-row td.incident-category:contains(${INCIDENT_CATEGORY})`), 1, 'Incident category appears in listing');
      assert.equal(jqueryLength(
        `.incident-row td.incident-category-item:contains(${INCIDENT_CATEGORY_ITEM})`
      ), 1, 'Incident category item appears in listing');
      assert.equal(find(jquerySelect('.incident-row td.incident-status:last')).textContent, 'Reported', 'Incident status of reported appears in listing');

      await visit('/incident/edit/56c64d71-ba30-4271-b899-f6f6b031f589');

      let incidentDate = moment(1489004400000);
      assert.equal(currentURL(), '/incident/edit/56c64d71-ba30-4271-b899-f6f6b031f589', 'Incident edit url is correct');
      assert.dom('.sentinel-event input').isChecked('Sentinel Event checkbox is checked');
      assert.dom('.incident-date input').hasValue(incidentDate.format(DATE_TIME_FORMAT), 'Date of incident displays');
      assert.dom('.incident-department .tt-input').hasValue('Reception', 'Incident department displays');
      assert.dom('.reported-to input').hasValue('Jane Bagadonuts', 'Reported to displays.');
      assert.equal(find('.incident-category option:checked').textContent.trim(), 'Accident or Injury', 'Category displays');
      assert.equal(find('.incident-category-item option:checked').textContent.trim(), 'Patient', 'Category item displays');
      assert.dom('.patient-name .tt-input').hasValue('Joe Bagadonuts - P00001', 'Patient impacted name displays');
      assert.dom('.patient-id').hasText('P00001', 'Patient id displays');
      assert.dom('.incident-description textarea').hasValue('Patient fell on wet floor.', 'Description displays');

      await fillIn('.incident-description textarea', INCIDENT_DESCRIPTION);
      assert.dom('.incident-description textarea').hasValue(INCIDENT_DESCRIPTION, 'Updated description displays');

      await click(jquerySelect('.panel-footer button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Incident Saved', ' Incident Saved modal appears');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await waitToDisappear('.modal-dialog');
      await click(jquerySelect('#notes tr button:contains(Edit)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Edit Note', ' Edit Note modal appears');

      await fillIn('.note-description textarea', EDIT_INCIDENT_NOTE);
      await click(jquerySelect('.modal-footer button:contains(Update)'));
      await waitToDisappear('.modal-dialog');
      assert.dom('.note-description').hasText(EDIT_INCIDENT_NOTE, 'Note is updated');

      await click(jquerySelect('#notes tr button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Note', ' Delete Note modal appears');

      await click(jquerySelect('.modal-footer button:contains(Delete)'));
      await waitToDisappear('.modal-dialog');
      assert.dom('.note-description').doesNotExist('Note has been deleted');

      await click(jquerySelect('.tab-nav li a:contains(Attachment)'));
      await waitToAppear('#attachments td a:contains(Download)');
      assert.equal(jqueryLength('#attachments td a:contains(Download)'), 1, 'Download button appears for attachment');

      await click(jquerySelect('#attachments td button:contains(Edit)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Edit Attachment', ' Edit Attachment modal appears');

      await fillIn('.attachment-title input', 'Incident Report Form');
      await click(jquerySelect('.modal-footer button:contains(Update)'));
      await waitToDisappear('.modal-dialog');
      assert.equal(jqueryLength('#attachments td:contains(Incident Report Form)'), 1, 'Updated attachment title appears');

      await click(jquerySelect('#attachments td button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Attachment', ' Delete Attachment modal appears');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.equal(jqueryLength('#attachments td:contains(Incident Report Form)'), 0, 'Deleted attachment disappears');
    });
  });

  test('Incident deletion', function(assert) {
    return runWithPouchDump('incident', async function() {
      await authenticateUser();
      await visit('/incident');
      assert.equal(currentURL(), '/incident', 'Incident listing url is correct');
      assert.dom('.incident-row').exists({ count: 1 }, 'One incident appears');

      await click(jquerySelect('.incident-row button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Incident', ' Delete Incident modal appears');

      await click(jquerySelect('.modal-footer button:contains(Delete)'));
      await waitToDisappear('.modal-dialog');
      assert.dom('.incident-row').doesNotExist('Incident diappears from list');
    });
  });

  testSimpleReportForm('Incidents By Department');
  testSimpleReportForm('Incidents By Category');

  function testSimpleReportForm(reportName) {
    test(`${reportName} report can be generated`, function(assert) {
      return runWithPouchDump('default', async function() {
        await authenticateUser();
        await visit('/incident/reports');
        assert.equal(currentURL(), '/incident/reports');

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

  async function addItem(assert, itemName) {
    await click(jquerySelect('button:contains(Add Item)'));
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Add Category Item', 'Add Category Item modal appears');

    await fillIn('.incident-category-item input', itemName);
    await click(jquerySelect('.modal-footer button:contains(Add)'));
    await waitToAppear(`.incident-category-item:contains(${itemName})`);
    assert.equal(jqueryLength(`.incident-category-item:contains(${itemName})`),
      1, 'New incident category item appears');
  }
});
