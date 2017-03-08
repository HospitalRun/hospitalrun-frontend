import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | Incidents', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

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
      assert.equal(find('.modal-title').text(), 'Delete Item', 'Delete Item modal appears');
      click('.modal-footer button:contains(Ok)');
      waitToDisappear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.incident-category-item:contains(Surgical Site Infection)').length,
                 0, 'Deleted incident category item disappears');
      click('button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Incident Category Saved',
                   'Incident Category saved modal appears');
      click('button:contains(Return)');
    });
    andThen(() => {
      assert.equal(currentURL(), '/admin/inc-category', 'Incident Categories url is correct');
      assert.equal(find('td.incident-catergory-name:contains(Infection Control)').length,
                   1, 'New incident category displays in listing');
    });

  });
});

function addItem(assert, itemName) {
  click('button:contains(Add Item)');
  waitToAppear('.modal-dialog');
  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Add Category Item',
                 'Add Category Item modal appears');
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
