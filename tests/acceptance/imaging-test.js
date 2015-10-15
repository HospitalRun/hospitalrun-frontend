import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | imaging', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /imaging', function(assert) {
  loadPouchDump('imaging');
  authenticateUser();
  visit('/imaging');

  andThen(function() {
    assert.equal(currentURL(), '/imaging');
    assert.equal(find('li a:contains(Requests)').length, 1, 'Requests link is visible');
    assert.equal(find('li a:contains(Completed)').length, 1, 'Completed link is visible');
    let newImagingButton = find('button:contains(new imaging)');
    assert.equal(newImagingButton.length, 1, 'New Imaging button is visible');
    findWithAssert('p:contains(No items found. )');
    findWithAssert('a:contains(Create a new record?)');
  });
  click('button:contains(new imaging)');
  andThen(() => {
    assert.equal(currentURL(), '/imaging/edit/new');
  });
  destroyDatabases();
});

test('creating a new imaging request', (assert) => {
  loadPouchDump('imaging');
  authenticateUser();
  visit('/imaging/edit/new');

  andThen(() => {
    assert.equal(currentURL(), '/imaging/edit/new');
  });
  fillIn(find('[data-test-selector="imaging-type-field"] input'), 'Chest Scan');
  //fillIn(find('[data-test-selector="imaging-result-field"]'), 'Chest looks fine');
  fillIn('[data-test-selector="imaging-notes-field"] textarea', 'Needs to have other scans taken');
  return pauseTest();
  destroyDatabases();
});
