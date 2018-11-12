import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:abstract-edit-controller', 'Unit | Controller | abstract-edit-controller', {
  needs: [
    'service:session',
    'service:lookupLists',
    'service:metrics',
    'config:environment',
    'service:intl',
    'ember-intl@adapter:default',
    'cldr:cn',
    'cldr:de',
    'cldr:en',
    'cldr:es',
    'cldr:gr',
    'cldr:hi',
    'cldr:pt',
    'cldr:th',
    'cldr:tw',
    'cldr:de',
    'cldr:es',
    'cldr:fr',
    'cldr:he',
    'cldr:it',
    'cldr:ru',
    'cldr:tr',
    'cldr:ur',
    'translation:en',
    'util:intl/missing-message'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:intl').setLocale('en');

    // manually inject the intl service as initialzer does not run
    // in unit test
    getOwner(this).inject('controller', 'intl', 'service:intl');
  }
});

test('cancelButtonText', function(assert) {
  assert.equal(this.subject().get('cancelButtonText'), 'Return');
});

test('cancelButtonText hasDirtyAttributes', function(assert) {
  let controller = this.subject({
    model: {
      hasDirtyAttributes: true
    }
  });

  assert.equal(controller.get('cancelButtonText'), 'Cancel');
});

test('disabledAction', function(assert) {
  assert.equal(this.subject({
    model: EmberObject.create()
  }).get('disabledAction'), 'showDisabledDialog');
});

test('disabledAction invalid', function(assert) {
  let controller = this.subject({
    model: EmberObject.create({
      isValid: true
    })
  });

  assert.strictEqual(controller.get('disabledAction'), undefined);
});

test('isNewOrDeleted', function(assert) {
  assert.strictEqual(this.subject().get('isNewOrDeleted'), undefined);
});

test('isNewOrDeleted new', function(assert) {
  let controller = this.subject({
    model: {
      isNew: true,
      isDeleted: false
    }
  });

  assert.strictEqual(controller.get('isNewOrDeleted'), true);
});

test('isNewOrDeleted deleted', function(assert) {
  let controller = this.subject({
    model: {
      isNew: false,
      isDeleted: true
    }
  });

  assert.strictEqual(controller.get('isNewOrDeleted'), true);
});

test('updateButtonText', function(assert) {
  assert.equal(this.subject().get('updateButtonText'), 'Update');
});

test('updateButtonText isNew', function(assert) {
  let controller = this.subject({
    model: {
      isNew: true
    }
  });

  assert.equal(controller.get('updateButtonText'), 'Add');
});

test('actions.showDisabledDialog message', function(assert) {
  let alertMessage, alertTitle;
  let controller = this.subject();

  controller.displayAlert = function stub(title, message) {
    alertTitle = title;
    alertMessage = message;
  };

  controller.send('showDisabledDialog');

  assert.equal(alertTitle, 'Warning!!!!');
  assert.equal(alertMessage, 'Please fill in required fields (marked with *) and correct the errors before saving.');
});

test('actions.update exception message', function(assert) {
  let alertMessage, alertTitle;
  let controller = this.subject();

  controller.beforeUpdate = function() {
    throw new Error('Test');
  };
  controller.displayAlert = function stub(title, message) {
    alertTitle = title.toString();
    alertMessage = message.toString();
    assert.equal(alertTitle, 'Error!!!!');
    assert.equal(alertMessage, 'An error occurred while attempting to save: Test');
  };

  run(() => {
    controller.send('update');
  });
});
