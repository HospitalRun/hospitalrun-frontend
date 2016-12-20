import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:abstract-report-controller', 'Unit | Controller | abstract-report-controller', {
  unit: true
});

test('actions.firstPage', function(assert) {
  let controller = this.subject();

  controller.send('firstPage');

  assert.strictEqual(controller.get('offset'), 0);
});

test('actions.nextPage', function(assert) {
  let controller = this.subject({
    offset: 8,
    limit: 4
  });

  controller.send('nextPage');

  assert.strictEqual(controller.get('offset'), 12);
});

test('actions.previousPage', function(assert) {
  let controller = this.subject({
    offset: 8,
    limit: 2
  });

  controller.send('previousPage');

  assert.strictEqual(controller.get('offset'), 6);
});

test('actions.lastPage', function(assert) {
  let controller = this.subject({
    limit: 1,
    offset: 0,
    reportRows: ['one', 'two', 'three']
  });

  controller.send('lastPage');

  assert.strictEqual(controller.get('offset'), 3);
});

test('currentReportRows', function(assert) {
  let controller = this.subject({
    limit: 2,
    offset: 1,
    reportRows: ['one', 'two', 'three', 'four']
  });

  assert.deepEqual(controller.get('currentReportRows'), ['two', 'three']);
});

test('disablePreviousPage', function(assert) {
  let controller = this.subject({
    offset: 0
  });

  assert.strictEqual(controller.get('disablePreviousPage'), true);
});

test('disablePreviousPage false', function(assert) {
  let controller = this.subject({
    offset: 2
  });

  assert.strictEqual(controller.get('disablePreviousPage'), false);
});

test('disableNextPage', function(assert) {
  let controller = this.subject({
    limit: 1,
    offset: 2,
    reportRows: ['one', 'two', 'three']
  });

  assert.strictEqual(controller.get('disableNextPage'), true);
});

test('disableNextPage false', function(assert) {
  let controller = this.subject({
    limit: 1,
    offset: 1,
    reportRows: ['one', 'two', 'three']
  });

  assert.strictEqual(controller.get('disableNextPage'), false);
});

test('showPagination', function(assert) {
  let controller = this.subject({
    limit: 1,
    offset: 0,
    reportRows: ['one', 'two', 'three']
  });

  assert.strictEqual(controller.get('showPagination'), true);
});

test('showPagination false', function(assert) {
  let controller = this.subject({
    limit: 3,
    offset: 0,
    reportRows: ['one', 'two', 'three']
  });

  assert.strictEqual(controller.get('showPagination'), false);
});
