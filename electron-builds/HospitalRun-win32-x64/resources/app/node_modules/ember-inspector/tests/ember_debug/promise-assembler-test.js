import Ember from "ember";
import { module, test } from 'qunit';
/*globals require*/
const PromiseAssembler = require('ember-debug/libs/promise-assembler').default;

let assembler;

let fakeRSVP;

function stubRSVP() {
  fakeRSVP = Ember.Object.extend(Ember.Evented, {
    configure: Ember.K
  }).create();
}

function startAssembler() {
  Ember.run(assembler, 'start');
}

module("PromiseAssembler", {
  beforeEach() {
    stubRSVP();
    Ember.run(function() {
      assembler = PromiseAssembler.create({
        RSVP: fakeRSVP
      });
    });

  },
  afterEach() {
    if (assembler) {
      Ember.run(assembler, 'destroy');
      assembler = null;
    }
  }
});

test("Creates promises correctly", function(assert) {
  startAssembler();
  let date = new Date();
  let event;

  assembler.on('created', function(e) {
    event = e;
  });

  fakeRSVP.trigger('created', {
    guid: 1,
    label: 'label',
    timeStamp: date,
    stack: 'stack'
  });

  assert.ok(event);
  let promise = event.promise;
  assert.equal(event.promise, assembler.find(promise.get('guid')));

  assert.equal(assembler.find().get('length'), 1);

  assert.equal(promise.get('guid'), 1);
  assert.equal(promise.get('label'), 'label');
  assert.equal(promise.get('createdAt'), date);
  assert.equal(promise.get('stack'), 'stack');
  assert.equal(promise.get('state'), 'created');
});

test("Chains a promise correctly (parent and child not-existing)", function(assert) {
  startAssembler();
  let date = new Date();
  let event;

  assembler.on('chained', function(e) {
    event = e;
  });

  fakeRSVP.trigger('chained', {
    guid: 1,
    label: 'label',
    timeStamp: date,
    childGuid: 2
  });

  let parent = event.promise;
  let child = event.child;

  assert.equal(assembler.find(parent.get('guid')), parent);
  assert.equal(assembler.find(child.get('guid')), child);

  assert.equal(assembler.find().get('length'), 2);

  assert.equal(parent.get('guid'), 1);
  assert.equal(parent.get('label'), 'label');
  assert.equal(parent.get('chainedAt'), date);
  assert.equal(parent.get('children.length'), 1);
  assert.equal(child.get('guid'), 2);
  assert.equal(child.get('parent'), parent);

});

test("Chains a promise correctly (parent and child existing)", function(assert) {

  startAssembler();
  let date = new Date();
  let event;
  let parent;
  let child;

  assembler.on('created', function(e) {
    parent = e.promise;
  });

  fakeRSVP.trigger('created', {
    guid: 1
  });

  assembler.off('created');

  assembler.on('created', function(e) {
    child = e.promise;
  });

  fakeRSVP.trigger('created', {
    guid: 2
  });


  assembler.on('chained', function(e) {
    event = e;
  });

  fakeRSVP.trigger('chained', {
    guid: 1,
    label: 'label',
    timeStamp: date,
    childGuid: 2
  });

  assert.equal(parent, event.promise);
  assert.equal(child, event.child);

  assert.equal(assembler.find(parent.get('guid')), parent);
  assert.equal(assembler.find(child.get('guid')), child);

  assert.equal(assembler.find().get('length'), 2);

  assert.equal(parent.get('guid'), 1);
  assert.equal(parent.get('label'), 'label');
  assert.equal(parent.get('chainedAt'), date);
  assert.equal(parent.get('children.length'), 1);
  assert.equal(child.get('guid'), 2);
  assert.equal(child.get('parent'), parent);

});

test("Fulfills a promise correctly", function(assert) {
  startAssembler();
  let date = new Date();
  let event;
  let promise;

  assembler.on('created', function(e) {
    promise = e.promise;
  });

  fakeRSVP.trigger('created', {
    guid: 1
  });

  assembler.off('created');

  assert.equal(promise.get('state'), 'created');

  assembler.on('fulfilled', function(e) {
    event = e;
  });

  fakeRSVP.trigger('fulfilled', {
    guid: 1,
    detail: 'value',
    timeStamp: date
  });

  assert.equal(event.promise, promise);
  assert.equal(promise.get('state'), 'fulfilled');
  assert.equal(promise.get('value'), 'value');
  assert.equal(promise.get('settledAt'), date);
  assert.equal(assembler.find().get('length'), 1);
});

test("Rejects a promise correctly", function(assert) {
  startAssembler();
  let date = new Date();
  let event;
  let promise;

  assembler.on('created', function(e) {
    promise = e.promise;
  });

  fakeRSVP.trigger('created', {
    guid: 1
  });

  assembler.off('created');

  assert.equal(promise.get('state'), 'created');

  assembler.on('rejected', function(e) {
    event = e;
  });

  fakeRSVP.trigger('rejected', {
    guid: 1,
    detail: 'reason',
    timeStamp: date
  });

  assert.equal(event.promise, promise);
  assert.equal(promise.get('state'), 'rejected');
  assert.equal(promise.get('reason'), 'reason');
  assert.equal(promise.get('settledAt'), date);
  assert.equal(assembler.find().get('length'), 1);
});

test('#stop', function(assert) {
  startAssembler();

  fakeRSVP.trigger('created', {
    guid: 1
  });
  assert.equal(assembler.find().get('length'), 1);

  Ember.run(assembler, 'stop');

  assert.equal(assembler.find().get('length'), 0);
  assembler.on('created', function() {
    assert.ok(false);
  });
  fakeRSVP.trigger('created', { guid: 1 });
  assert.equal(assembler.find().get('length'), 0);
});
