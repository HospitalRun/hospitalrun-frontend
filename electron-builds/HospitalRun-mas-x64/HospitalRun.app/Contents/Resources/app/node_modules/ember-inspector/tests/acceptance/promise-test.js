import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
const { $ } = Ember;

let App;
let port, message, name;

module('Promise Tab', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
    port.reopen({
      send(n, m) {
        if (n === 'promise:getAndObservePromises') {
          port.trigger('promise:promisesUpdated', {
            promises: []
          });
        }
        name = n;
        message = m;
      }
    });
  },
  afterEach() {
    name = null;
    message = null;
    Ember.run(App, App.destroy);
  }
});

let guids = 0;
function generatePromise(props) {
  return $.extend({
    guid: ++guids,
    label: 'Generated Promise',
    parent: null,
    children: null,
    state: 'created',
    value: null,
    reason: null,
    createdAt: Date.now(),
    hasStack: false
  }, props);
}

test("Shows page refresh hint if no promises", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: []
  });

  assert.equal(find('.js-promise-tree').length, 0, "no promise list");
  assert.equal(find('.js-page-refresh').length, 1, "page refresh hint seen");

  await click('.js-page-refresh-btn');

  assert.equal(name, 'general:refresh');

  await triggerPort('promise:promisesUpdated', {
    promises: [
      generatePromise({
        guid: 1,
        label: 'Promise 1',
        state: 'created'
      })
    ]
  });

  assert.equal(find('.js-promise-tree').length, 1, 'promise tree is seen after being populated');
  assert.equal(find('.js-promise-tree-item').length, 1, '1 promise item can be seen');
  assert.equal(find('.js-page-refresh').length, 0, 'page refresh hint hidden');

  // make sure clearing does not show the refresh hint
  await click('.js-clear-promises-btn');

  assert.equal(find('.js-promise-tree').length, 1, 'promise-tree can be seen');
  assert.equal(find('.js-promise-tree-item').length, 0, 'promise items cleared');
  assert.equal(find('.js-page-refresh').length, 0, 'page refresh hint hidden');
});

test("Pending promise", async function(assert) {

  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [
      generatePromise({
        guid: 1,
        label: 'Promise 1',
        state: 'created'
      })
    ]
  });
  await wait();

  assert.equal(find('.js-promise-tree-item').length, 1);
  let row = find('.js-promise-tree-item').first();
  assert.equal(find('.js-promise-label', row).text().trim(), 'Promise 1');
  assert.equal(find('.js-promise-state', row).text().trim(), 'Pending');
});


test("Fulfilled promise", async function(assert) {
  await visit('/promise-tree');

  let now = Date.now();

  triggerPort('promise:promisesUpdated', {
    promises: [
      generatePromise({
        guid: 1,
        label: 'Promise 1',
        state: 'fulfilled',
        value: {
          inspect: 'value',
          type: 'type-string'
        },
        createdAt: now,
        settledAt: now + 10
      })
    ]
  });
  await wait();

  assert.equal(find('.js-promise-tree-item').length, 1);
  let row = find('.js-promise-tree-item').first();
  assert.equal(find('.js-promise-label', row).text().trim(), 'Promise 1');
  assert.equal(find('.js-promise-state', row).text().trim(), 'Fulfilled');
  assert.equal(find('.js-promise-value', row).text().trim(), 'value');
  assert.equal(find('.js-promise-time', row).text().trim(), '10.00ms');
});


test("Rejected promise", async function(assert) {
  await visit('/promise-tree');

  let now = Date.now();

  await triggerPort('promise:promisesUpdated', {
    promises: [
      generatePromise({
        guid: 1,
        label: 'Promise 1',
        state: 'rejected',
        reason: {
          inspect: 'reason',
          type: 'type-string'
        },
        createdAt: now,
        settledAt: now + 20
      })
    ]
  });

  assert.equal(find('.js-promise-tree-item').length, 1);
  let row = find('.js-promise-tree-item').first();
  assert.equal(find('.js-promise-label', row).text().trim(), 'Promise 1');
  assert.equal(find('.js-promise-state', row).text().trim(), 'Rejected');
  assert.equal(find('.js-promise-value', row).text().trim(), 'reason');
  assert.equal(find('.js-promise-time', row).text().trim(), '20.00ms');
});

test("Chained promises", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [
      generatePromise({
        guid: 2,
        parent: 1,
        label: 'Child'
      }),
      generatePromise({
        guid: 1,
        children: [2],
        label: 'Parent'
      })
    ]
  });

  let rows = find('.js-promise-tree-item');
  assert.equal(rows.length, 1, 'Collpased by default');
  assert.equal(find('.js-promise-label', rows.eq(0)).text().trim(), 'Parent');
  await click('.js-promise-label', rows.eq(0));

  rows = find('.js-promise-tree-item');
  assert.equal(rows.length, 2, 'Chain now expanded');
  assert.equal(find('.js-promise-label', rows.eq(1)).text().trim(), 'Child');
});

test("Can trace promise when there is a stack", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [generatePromise({ guid: 1, hasStack: true })]
  });

  await click('.js-trace-promise-btn');

  assert.equal(name, 'promise:tracePromise');
  assert.deepEqual(message, { promiseId: 1 });
});


test("Trace button hidden if promise has no stack", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [generatePromise({ guid: 1, hasStack: false })]
  });

  assert.equal(find('.js-trace-promise-btn').length, 0);
});

test("Toggling promise trace option", async function(assert) {
  assert.expect(3);

  await visit('/promise-tree');

  let input = find('.js-with-stack').find('input');
  assert.ok(!input.prop('checked'), 'should not be checked by default');
  await click(input);

  assert.equal(name, 'promise:setInstrumentWithStack');
  assert.equal(message.instrumentWithStack, true);
});

test("Logging error stack trace in the console", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [generatePromise({
      guid: 1,
      state: 'rejected',
      reason: {
        inspect: 'some error',
        type: 'type-error'
      }
    })]
  });

  let row = find('.js-promise-tree-item').first();
  assert.equal(find('.js-send-to-console-btn').text().trim(), 'Stack trace');
  await click('.js-send-to-console-btn', row);

  assert.equal(name, 'promise:sendValueToConsole');
  assert.deepEqual(message, { promiseId: 1 });
});


test("Send fulfillment value to console", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [generatePromise({
      guid: 1,
      state: 'fulfilled',
      value: {
        inspect: 'some string',
        type: 'type-string'
      }
    })]
  });

  let row = find('.js-promise-tree-item').first();
  await click('.js-send-to-console-btn', row);

  assert.equal(name, 'promise:sendValueToConsole');
  assert.deepEqual(message, { promiseId: 1 });
});

test("Sending objects to the object inspector", async function(assert) {
  await visit('/promise-tree');

  await triggerPort('promise:promisesUpdated', {
    promises: [generatePromise({
      guid: 1,
      state: 'fulfilled',
      value: {
        inspect: 'Some Object',
        type: 'type-ember-object',
        objectId: 100
      }
    })]
  });

  let row = find('.js-promise-tree-item').first();
  await click('.js-promise-object-value', row);

  assert.equal(name, 'objectInspector:inspectById');
  assert.deepEqual(message, { objectId: 100 });
});
