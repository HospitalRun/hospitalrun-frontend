import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | abstract-edit-controller', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').setLocale('en');
  });

  test('cancelButtonText', function(assert) {
    assert.equal(this.owner.lookup('controller:abstract-edit-controller').get('cancelButtonText'), 'Return');
  });

  test('cancelButtonText hasDirtyAttributes', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-edit-controller').create({
      model: {
        hasDirtyAttributes: true
      }
    });

    assert.equal(controller.get('cancelButtonText'), 'Cancel');
  });

  test('disabledAction', function(assert) {
    assert.equal(this.owner.factoryFor('controller:abstract-edit-controller').create({
      model: EmberObject.create()
    }).get('disabledAction'), 'showDisabledDialog');
  });

  test('disabledAction invalid', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-edit-controller').create({
      model: EmberObject.create({
        isValid: true
      })
    });

    assert.strictEqual(controller.get('disabledAction'), undefined);
  });

  test('isNewOrDeleted', function(assert) {
    assert.strictEqual(this.owner.lookup('controller:abstract-edit-controller').get('isNewOrDeleted'), undefined);
  });

  test('isNewOrDeleted new', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-edit-controller').create({
      model: {
        isNew: true,
        isDeleted: false
      }
    });

    assert.strictEqual(controller.get('isNewOrDeleted'), true);
  });

  test('isNewOrDeleted deleted', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-edit-controller').create({
      model: {
        isNew: false,
        isDeleted: true
      }
    });

    assert.strictEqual(controller.get('isNewOrDeleted'), true);
  });

  test('updateButtonText', function(assert) {
    assert.equal(this.owner.lookup('controller:abstract-edit-controller').get('updateButtonText'), 'Update');
  });

  test('updateButtonText isNew', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-edit-controller').create({
      model: {
        isNew: true
      }
    });

    assert.equal(controller.get('updateButtonText'), 'Add');
  });

  test('actions.showDisabledDialog message', function(assert) {
    let alertMessage, alertTitle;
    let controller = this.owner.lookup('controller:abstract-edit-controller');

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
    let controller = this.owner.lookup('controller:abstract-edit-controller');

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
});
