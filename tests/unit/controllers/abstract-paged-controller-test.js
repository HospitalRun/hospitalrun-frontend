import { moduleFor, test } from 'ember-qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import Ember from 'ember';
import DS from 'ember-data';

moduleFor('controller:abstract-paged-controller', 'Unit | Controller | abstract-paged-controller', {
  unit: true,
  testModel(attrs) {
    return Ember.run(() => {
      this.register('model:test', DS.Model);
      return this.store().createRecord('test', attrs);
    });
  },
  store() {
    return this.container.lookup('service:store');
  }
});

test('showActions', function(assert) {
  let controller = this.subject({
    canAdd: false,
    canEdit: true,
    canDelete: false
  });

  assert.strictEqual(controller.get('showActions'), true);
});

test('disablePreviousPage', function(assert) {
  let controller = this.subject();

  assert.strictEqual(controller.get('disablePreviousPage'), true);
});

test('disablePreviousPage false', function(assert) {
  let controller = this.subject({
    previousStartKey: 'test'
  });

  assert.strictEqual(controller.get('disablePreviousPage'), false);
});

test('disableNextPage', function(assert) {
  let controller = this.subject();

  assert.strictEqual(controller.get('disableNextPage'), true);
});

test('disableNextPage false', function(assert) {
  let controller = this.subject({
    nextStartKey: 'test'
  });

  assert.strictEqual(controller.get('disableNextPage'), false);
});

test('showPagination', function(assert) {
  let controller = this.subject({
    previousStartKey: 'test'
  });

  assert.strictEqual(controller.get('showPagination'), true);
});

test('showPagination false', function(assert) {
  let controller = this.subject();

  assert.strictEqual(controller.get('showPagination'), false);
});

test('hasRecords', function(assert) {
  let controller = this.subject({
    model: this.testModel({
      length: 1
    })
  });

  assert.strictEqual(controller.get('hasRecords'), true);
});

test('hasRecords false', function(assert) {
  let controller = this.subject({
    model: this.testModel({
      length: 0
    })
  });

  assert.strictEqual(controller.get('hasRecords'), false);
});

test('hasRecords false empty', function(assert) {
  assert.strictEqual(this.subject().get('hasRecords'), false);
});

sinonTest('actions.nextPage', function(assert) {
  let controller = this.subject({
    nextStartKey: 'next',
    previousStartKeys: ['prev1', 'prev2'],
    firstKey: 'first'
  });
  let showProgressModal = this.stub(controller, 'showProgressModal');

  controller.send('nextPage');

  assert.strictEqual(controller.get('previousStartKey'), 'first', 'Should set previousStartKey');
  assert.deepEqual(controller.get('previousStartKeys'), ['prev1', 'prev2', 'first'], 'Should set previousStartKeys');
  assert.strictEqual(controller.get('startKey'), 'next', 'Should set startKey');
  assert.ok(showProgressModal.calledOnce, 'Should show progress modal');
});

sinonTest('actions.previousPage', function(assert) {
  let controller = this.subject({
    previousStartKey: 'prev',
    previousStartKeys: ['prev1', 'prev2', 'prev3']
  });
  let showProgressModal = this.stub(controller, 'showProgressModal');

  controller.send('previousPage');

  assert.strictEqual(controller.get('startKey'), 'prev', 'Should set startKey');
  assert.strictEqual(controller.get('previousStartKey'), 'prev2', 'Should set previousStartKey');
  assert.deepEqual(controller.get('previousStartKeys'), ['prev1'], 'Should set previousStartKey');
  assert.ok(showProgressModal.calledOnce, 'Should show progress modal');
});

sinonTest('actions.sortByKey', function(assert) {
  let controller = this.subject({
    nextStartKey: 'next',
    previousStartKey: 'prev',
    previousStartKeys: ['prev1', 'prev2'],
    firstKey: 'first',
    startKey: 'start'
  });
  let showProgressModal = this.stub(controller, 'showProgressModal');

  controller.send('sortByKey', 'sort', 'desc');

  assert.strictEqual(controller.get('nextStartKey'), null, 'Should clear nextStartKey');
  assert.strictEqual(controller.get('firstKey'), null, 'Should clear firstKey');
  assert.strictEqual(controller.get('startKey'), null, 'Should clear startKey');
  assert.deepEqual(controller.get('previousStartKeys'), [], 'Should clear previousStartKeys');
  assert.strictEqual(controller.get('previousStartKey'), null, 'Should clear previousStartKey');

  assert.strictEqual(controller.get('sortDesc'), 'desc', 'Should set sortDesc');
  assert.strictEqual(controller.get('sortKey'), 'sort', 'Should set sortKey');

  assert.ok(showProgressModal.calledOnce, 'Should show progress modal');
});
