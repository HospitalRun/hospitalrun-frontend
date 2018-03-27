import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import Ember from 'ember';
import DS from 'ember-data';

moduleFor('controller:abstract-delete-controller', 'Unit | Controller | abstract-delete-controller', {
  unit: true,
  testModel(attrs) {
    return Ember.run(() => {
      this.register('model:test', DS.Model);
      return this.store().createRecord('test', attrs);
    });
  },
  store() {
    return this.container.lookup('service:store');
  },
  sendStub(controller) {
    let once = false;
    let originalSend = controller.send.bind(controller);
    return (arg) => {
      if (once) {
        return;
      }

      once = true;
      originalSend(arg);
    };
  }
});

test('actions.cancel', function(assert) {
  let controller = this.subject();
  let sendStubFn = this.sendStub(controller);
  let send = this.stub(controller, 'send').callsFake(sendStubFn);

  controller.send('cancel');

  assert.equal(send.getCall(0).args[0], 'cancel');
  assert.equal(send.getCall(1).args[0], 'closeModal', 'Should close modal');
});

test('actions.delete', function(assert) {
  let controller = this.subject({
    model: this.testModel({
      save: () => {},
      unloadRecord: () => {}
    })
  });
  let sendStubFn = this.sendStub(controller);
  let send = this.stub(controller, 'send').callsFake(sendStubFn);
  let save = this.stub(controller.get('model'), 'save').callsFake(() => {
    return new Ember.RSVP.Promise((resolve) => resolve());
  });
  let unloadRecord = this.stub(controller.get('model'), 'unloadRecord');

  Ember.run(() => controller.send('delete'));

  assert.equal(send.getCall(0).args[0], 'delete');
  assert.ok(save.calledOnce, 'Should save model');
  assert.strictEqual(controller.get('model.archived'), true, 'Should archive model');
  assert.ok(unloadRecord.calledOnce, 'Should unload record of model');
  assert.equal(send.getCall(1).args[0], 'closeModal', 'Should close modal');
});
