import EmberObject from '@ember/object';
import moment from 'moment';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | abstract-report-controller', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').set('locale', 'en');
  });

  sinonTest('_notifyReportError', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create();
    let closeProgressModal = this.stub(controller, 'closeProgressModal');
    let displayAlert = this.stub(controller, 'displayAlert');

    assert.throws(() => {
      controller._notifyReportError('error message');
    }, new Error('error message'), 'Should throw error');

    assert.equal(
      displayAlert.getCall(0).args[0],
      'Error Generating Report',
      'Should set alert title'
    );
    assert.equal(
      displayAlert.getCall(0).args[1],
      'An error was encountered while generating the requested report.  Please let your system administrator know that you have encountered an error.',
      'Should set alert message'
    );
    assert.ok(closeProgressModal.calledOnce, 'Should close progress modal');
  });

  sinonTest('_setReportTitle', function(assert) {
    let endDate = new Date(1482269979422);
    let startDate = new Date(1472269979422);
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      endDate,
      startDate,
      reportTypes: [
        EmberObject.create({
          value: 'one',
          name: 'Number One'
        }),
        EmberObject.create({
          value: 'two',
          name: 'Number Two'
        })
      ],
      reportType: 'two'
    });
    controller._setReportTitle();

    assert.equal(controller.get('reportTitle').toString(), `Number Two Report ${moment(startDate).format('l')} - ${moment(endDate).format('l')}`);
  });

  sinonTest('_setReportTitle single date', function(assert) {
    let endDate = new Date(1472269979422);
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      endDate,
      reportTypes: [
        EmberObject.create({
          value: 'one',
          name: 'Number One'
        }),
        EmberObject.create({
          value: 'two',
          name: 'Number Two'
        })
      ],
      reportType: 'one'
    });

    this.stub(window, 'moment').callsFake(() => {
      return {
        format() {
          return 'April 3rd, 2015';
        }
      };
    });

    controller._setReportTitle();

    assert.equal(controller.get('reportTitle').toString(), `Number One Report ${moment(endDate).format('l')}`);
  });

  test('actions.firstPage', function(assert) {
    let controller = this.owner.lookup('controller:abstract-report-controller');

    controller.send('firstPage');

    assert.strictEqual(controller.get('offset'), 0);
  });

  test('actions.nextPage', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      offset: 8,
      limit: 4
    });

    controller.send('nextPage');

    assert.strictEqual(controller.get('offset'), 12);
  });

  test('actions.previousPage', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      offset: 8,
      limit: 2
    });

    controller.send('previousPage');

    assert.strictEqual(controller.get('offset'), 6);
  });

  test('actions.lastPage', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      limit: 1,
      offset: 0,
      reportRows: ['one', 'two', 'three']
    });

    controller.send('lastPage');

    assert.strictEqual(controller.get('offset'), 3);
  });

  test('currentReportRows', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      limit: 2,
      offset: 1,
      reportRows: ['one', 'two', 'three', 'four']
    });

    assert.deepEqual(controller.get('currentReportRows'), ['two', 'three']);
  });

  test('disablePreviousPage', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      offset: 0
    });

    assert.strictEqual(controller.get('disablePreviousPage'), true);
  });

  test('disablePreviousPage false', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      offset: 2
    });

    assert.strictEqual(controller.get('disablePreviousPage'), false);
  });

  test('disableNextPage', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      limit: 1,
      offset: 2,
      reportRows: ['one', 'two', 'three']
    });

    assert.strictEqual(controller.get('disableNextPage'), true);
  });

  test('disableNextPage false', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      limit: 1,
      offset: 1,
      reportRows: ['one', 'two', 'three']
    });

    assert.strictEqual(controller.get('disableNextPage'), false);
  });

  test('showPagination', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      limit: 1,
      offset: 0,
      reportRows: ['one', 'two', 'three']
    });

    assert.strictEqual(controller.get('showPagination'), true);
  });

  test('showPagination false', function(assert) {
    let controller = this.owner.factoryFor('controller:abstract-report-controller').create({
      limit: 3,
      offset: 0,
      reportRows: ['one', 'two', 'three']
    });

    assert.strictEqual(controller.get('showPagination'), false);
  });
});
