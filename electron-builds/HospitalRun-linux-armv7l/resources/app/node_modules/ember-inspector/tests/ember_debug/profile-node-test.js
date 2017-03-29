/*globals require */
import { module, test } from 'qunit';
const ProfileNode = require('ember-debug/models/profile-node').default;

module("ProfileNode");

test("It can create a ProfileNode", function(assert) {
  let p = new ProfileNode(1001, { template: 'application' });

  assert.ok(!!p, "it creates a ProfileNode");
  assert.equal(p.start, 1001, "it stores the start time");
  assert.equal(p.name, "application", "it extracted the correct name");
  assert.equal(p.children.length, 0, "it has no children by default");
  assert.ok(!p.time, "It has no time because it's unfinished");
});

test("with no payload it has an unknown name", function(assert) {
  let p = new ProfileNode(1234);
  assert.equal(p.name, "Unknown view");
});

test("It can extract the name from an object payload", function(assert) {
  let p = new ProfileNode(1000, {
    object: {
      toString() { return "custom toString()"; }
    }
  });

  assert.equal(p.name, "custom toString()", "it called toString()");
});

test("It can create a child ProfileNode", function(assert) {
  let p1 = new ProfileNode(new Date().getTime(), { template: 'items' });
  let p2 = new ProfileNode(new Date().getTime(), { template: 'item' }, p1);

  assert.ok(!p1.parent, "Without a parent parameter, the attribute is not set");
  assert.equal(p2.parent, p1, "If passed, p2's parent is assigned to p1");
  assert.ok(!p1.time, "p1 has no time because it's unfinished");
  assert.ok(!p2.time, "p2 has no time because it's unfinished");
});

test("It can finish the timer", function(assert) {
  let p = new ProfileNode(1000, { template: 'users' });
  p.finish(1004);
  assert.equal(p.time, 4, "it took 4 ms");
});

test("When a node has children, they are inserted when finished", function(assert) {
  let p1 = new ProfileNode(1000, { template: 'candies' });
  let p2 = new ProfileNode(1001, { template: 'candy' }, p1);

  assert.equal(p1.children.length, 0, "has no children at first");
  p2.finish(2022);
  assert.equal(p1.children[0], p2, "has a child after p2 finishes");
});

test("Can be serialized as JSON", function(assert) {
  let p1 = new ProfileNode(1000, { template: 'donuts' });
  let p2 = new ProfileNode(1001, { template: 'donut' }, p1);

  p2.finish(1003);
  p1.finish(1004);

  assert.ok(JSON.stringify(p1), "it can serialize due to no cycles in the object");
});

test("Name takes the following priority: display, containerKey, object", function(assert) {
  let p;
  p = new ProfileNode(1000, { view: { instrumentDisplay: 'donuts', _debugContainerKey: 'candy' }, object: 'coffee' });
  assert.equal(p.name, 'donuts');
  p = new ProfileNode(1000, { view: { _debugContainerKey: 'candy' }, object: 'coffee' });
  assert.equal(p.name, 'candy');
  p = new ProfileNode(1000, { object: 'coffee' });
  assert.equal(p.name, 'coffee');
});
