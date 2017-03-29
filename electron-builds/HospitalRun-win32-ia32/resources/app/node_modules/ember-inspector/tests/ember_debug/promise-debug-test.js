import Ember from "ember";
import { module, test } from 'qunit';
/*globals require */
const EmberDebug = require("ember-debug/main").default;

let port, name, message, RSVP = Ember.RSVP;
let App;
let { run, K, A: emberA } = Ember;

function setupApp() {
  App = Ember.Application.create();
  App.injectTestHelpers();
  App.setupForTesting();
}

// RSVP instrumentation is out of band (50 ms delay)
async function rsvpDelay() {
  Ember.run.later(function() {}, 100);
  await wait();
}

module("Promise Debug", {
  beforeEach() {

    EmberDebug.Port = EmberDebug.Port.extend({
      init() {},
      send(n, m) {
        name = n;
        message = m;
      }
    });
    run(function() {
      setupApp();
      EmberDebug.set('application', App);
    });
    Ember.run(EmberDebug, 'start');
    EmberDebug.get('promiseDebug').reopen({
      delay: 5,
      session: {
        getItem: Ember.K,
        setItem: Ember.K,
        removeItem: Ember.K
      }
    });
    port = EmberDebug.port;
  },
  afterEach() {
    name = null;
    message = null;
    EmberDebug.destroyContainer();
    Ember.run(App, 'destroy');
  }
});

test("Existing promises sent when requested", async function t(assert) {
  let promise1, child1, promise2;

  run(function() {
    RSVP.resolve('value', "Promise1")
    .then(function() {}, null, "Child1");

    // catch so we don't get a promise failure
    RSVP.reject('reason', "Promise2").catch(K);
  });

  await rsvpDelay();

  port.trigger('promise:getAndObservePromises');

  assert.equal(name, 'promise:promisesUpdated');

  let promises = emberA(message.promises);

  promise1 = promises.findBy('label', 'Promise1');
  child1 = promises.findBy('label', 'Child1');
  promise2 = promises.findBy('label', 'Promise2');

  assert.equal(promise1.label, 'Promise1');
  assert.equal(promise1.state, 'fulfilled');
  assert.equal(promise1.children.length, 1);
  assert.equal(promise1.children[0], child1.guid);

  assert.equal(child1.label, 'Child1');
  assert.equal(child1.state, 'fulfilled');
  assert.equal(child1.parent, promise1.guid);

  assert.equal(promise2.label, 'Promise2');
  assert.equal(promise2.state, 'rejected');


});

test("Updates are published when they happen", function(assert) {
  port.trigger('promise:getAndObservePromises');

  let p;

  run(function() {
    p = new RSVP.Promise(function() {}, "Promise1");
  });

  let done = assert.async();
  Ember.run.later(function() {
    assert.equal(name, 'promise:promisesUpdated');
    let promises = emberA(message.promises);
    let promise = promises.findBy('label', 'Promise1');
    assert.ok(!!promise);
    if (promise) {
      assert.equal(promise.label, 'Promise1');
      p.then(function() {}, null, "Child1");
      Ember.run.later(function() {
        assert.equal(name, 'promise:promisesUpdated');
        assert.equal(message.promises.length, 2);
        let child = message.promises[0];
        assert.equal(child.parent, promise.guid);
        assert.equal(child.label, 'Child1');
        let parent = message.promises[1];
        assert.equal(parent.guid, promise.guid);
        done();
      }, 200);
    }
  }, 200);
});


test("Instrumentation with stack is persisted to session storage", function(assert) {
  let withStack = false;
  EmberDebug.get('promiseDebug').reopen({
    session: {
      getItem(/*key*/) {
        return withStack;
      },
      setItem(key, val) {
        withStack = val;
      }
    }
  });
  // Clear CP cache
  EmberDebug.get('promiseDebug').propertyDidChange('instrumentWithStack');

  andThen(function() {
    port.trigger('promise:getInstrumentWithStack');
    return wait();
  });

  andThen(function() {
    assert.equal(name, 'promise:instrumentWithStack');
    assert.equal(message.instrumentWithStack, false);
    port.trigger('promise:setInstrumentWithStack', {
      instrumentWithStack: true
    });
    return wait();
  });

  andThen(function() {
    assert.equal(name, 'promise:instrumentWithStack');
    assert.equal(message.instrumentWithStack, true);
    assert.equal(withStack, true, 'persisted');
    port.trigger('promise:setInstrumentWithStack', {
      instrumentWithStack: false
    });
    return wait();
  });

  andThen(function() {
    assert.equal(name, 'promise:instrumentWithStack');
    assert.equal(message.instrumentWithStack, false);
    assert.equal(withStack, false, 'persisted');
  });

});

test("Responds even if no promises detected", function(assert) {
  port.trigger('promise:getAndObservePromises');
  assert.equal(name, 'promise:promisesUpdated');
  assert.equal(message.promises.length, 0);
});
