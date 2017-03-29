import Ember from "ember";
import { module, test } from 'qunit';
import computed from 'ember-new-computed';

let EmberDebug;
let port, name, message;
let App;
let objectInspector;

const { run, guidFor, Object: EmberObject, Handlebars: { compile } } = Ember;

function setupApp() {
  App = Ember.Application.create();
  App.setupForTesting();
  App.injectTestHelpers();

  App.Router.map(function() {
    this.route('simple');
  });

  App.XSimpleComponent = Ember.Component;

  Ember.TEMPLATES.simple = compile('Simple {{input class="simple-input"}} {{x-simple class="simple-view"}}');
}

let ignoreErrors = true;

module("Ember Debug - Object Inspector", {
  // eslint-disable-next-line object-shorthand
  beforeEach: async function() {
    /* globals require */
    EmberDebug = require('ember-debug/main').default;
    EmberDebug.Port = EmberDebug.Port.extend({
      init() {},
      send(n, m) {
        if (ignoreErrors && n.match(/[Ee]rror/)) {
          return;
        }
        name = n;
        message = m;
      }
    });
    run(() => {
      setupApp();
      EmberDebug.set('application', App);
    });
    run(EmberDebug, 'start');
    await wait();
    objectInspector = EmberDebug.get('objectInspector');
    port = EmberDebug.port;
  },
  afterEach() {
    name = null;
    message = null;
    EmberDebug.destroyContainer();
    run(App, 'destroy');
  }
});

test("An Ember Object is correctly transformed into an inspection hash", function(assert) {
  let date = new Date();

  let Parent = Ember.Object.extend({
    id: null,
    name: 'My Object'
  });

  Parent.reopenClass({
    toString() {
      return 'Parent Object';
    }
  });

  let inspected = Parent.create({
    id: 1,
    toString() {
      return `Object:${this.get('name')}`;
    },
    nullVal: null,
    dateVal: date
  });

  objectInspector.sendObject(inspected);

  assert.equal(name, 'objectInspector:updateObject');

  assert.equal(message.name, 'Object:My Object');

  let firstDetail = message.details[0];
  assert.equal(firstDetail.name, 'Own Properties');

  assert.equal(firstDetail.properties.length, 3, 'methods are not included');

  let idProperty = firstDetail.properties[0];
  assert.equal(idProperty.name, 'id');
  assert.equal(idProperty.value.type, 'type-number');
  assert.equal(idProperty.value.inspect, '1');

  let nullProperty = firstDetail.properties[1];
  assert.equal(nullProperty.name, 'nullVal');
  assert.equal(nullProperty.value.type, 'type-null');
  assert.equal(nullProperty.value.inspect, 'null');

  let prop = firstDetail.properties[2];
  assert.equal(prop.name, 'dateVal');
  assert.equal(prop.value.type, 'type-date');
  assert.equal(prop.value.inspect, date.toString());

  let secondDetail = message.details[1];
  assert.equal(secondDetail.name, 'Parent Object');

  idProperty = secondDetail.properties[0];
  assert.equal(idProperty.name, 'id');
  assert.equal(idProperty.overridden, 'Own Properties');

  let nameProperty = secondDetail.properties[1];
  assert.equal(nameProperty.name, 'name');
  assert.equal(nameProperty.value.inspect, 'My Object');

});

test("Computed properties are correctly calculated", function(assert) {
  let inspected = Ember.Object.extend({
    hi: computed(function() {
      return 'Hello';
    }).property(),
    _debugInfo() {
      return {
        propertyInfo: {
          expensiveProperties: ['hi']
        }
      };
    }
  }).create();

  objectInspector.sendObject(inspected);

  let computedProperty = message.details[1].properties[0];

  assert.equal(computedProperty.name, 'hi');
  assert.ok(computedProperty.value.computed);
  assert.equal(computedProperty.value.type, 'type-descriptor');
  assert.equal(computedProperty.value.inspect, '<computed>');

  let id = message.objectId;

  port.trigger('objectInspector:calculate', {
    objectId: id,
    property: 'hi',
    mixinIndex: 1
  });

  assert.equal(name, 'objectInspector:updateProperty');
  assert.equal(message.objectId, id);
  assert.equal(message.property, 'hi');
  assert.equal(message.mixinIndex, 1);
  assert.equal(message.value.type, 'type-string');
  assert.equal(message.value.inspect, 'Hello');
  assert.ok(message.value.computed);

});

test("Cached Computed properties are pre-calculated", function(assert) {
  let inspected = Ember.Object.extend({
    hi: computed(function() {
      return 'Hello';
    }).property()
  }).create();

  // pre-calculate CP
  inspected.get('hi');

  objectInspector.sendObject(inspected);

  let computedProperty = message.details[1].properties[0];

  assert.equal(computedProperty.name, 'hi');
  assert.ok(computedProperty.value.computed);
  assert.equal(computedProperty.value.type, 'type-string');
  assert.equal(computedProperty.value.inspect, 'Hello');

});

test("Properties are correctly bound", function(assert) {
  let inspected = Ember.Object.extend({
    name: 'Teddy',

    hi: computed({
      get() {
        return 'hello';
      },
      set(key, val) {
        return val;
      }
    }),

    _debugInfo() {
      return {
        propertyInfo: {
          expensiveProperties: ['hi']
        }
      };
    }

  }).create();

  objectInspector.sendObject(inspected);

  let id = message.objectId;

  inspected.set('name', 'Alex');

  assert.equal(name, 'objectInspector:updateProperty');

  assert.equal(message.objectId, id);
  assert.equal(message.property, 'name');
  assert.equal(message.mixinIndex, 1);
  assert.equal(message.value.computed, false);
  assert.equal(message.value.inspect, 'Alex');
  assert.equal(message.value.type, 'type-string');

  // un-cached computed properties are not bound until calculated

  message = null;

  inspected.set('hi', 'Hey');

  assert.equal(message, null, 'Computed properties are not bound as long as they haven\'t been calculated');

  port.trigger('objectInspector:calculate', {
    objectId: id,
    property: 'hi',
    mixinIndex: 1
  });

  message = null;
  inspected.set('hi', 'Hello!');

  assert.equal(message.objectId, id);
  assert.equal(message.property, 'hi');
  assert.equal(message.mixinIndex, 1);
  assert.ok(message.value.computed);
  assert.equal(message.value.inspect, 'Hello!');
  assert.equal(message.value.type, 'type-string');
});

test("Properties can be updated through a port message", function(assert) {
  let inspected = Ember.Object.extend({
    name: 'Teddy'
  }).create();

  objectInspector.sendObject(inspected);

  let id = message.objectId;

  port.trigger('objectInspector:saveProperty', {
    objectId: id,
    mixinIndex: 1,
    property: 'name',
    value: 'Alex'
  });

  assert.equal(inspected.get('name'), 'Alex');

  // A property updated message is published
  assert.equal(name, 'objectInspector:updateProperty');
  assert.equal(message.property, 'name');
  assert.equal(message.value.inspect, 'Alex');
  assert.equal(message.value.type, 'type-string');
});

test("Date properties are converted to dates before being updated", function(assert) {
  let newDate = new Date(2015, 0, 1);

  let inspected = Ember.Object.extend({
    date: null
  }).create();

  objectInspector.sendObject(inspected);

  let id = message.objectId;

  port.trigger('objectInspector:saveProperty', {
    objectId: id,
    mixinIndex: 1,
    property: 'date',
    value: newDate.getTime(),
    dataType: 'date'
  });

  assert.equal(inspected.get('date').getFullYear(), 2015);
  assert.equal(inspected.get('date').getMonth(), 0);
  assert.equal(inspected.get('date').getDate(), 1);
});

test("Property grouping can be customized using _debugInfo", function(assert) {
  let mixinToSkip = Ember.Mixin.create({});
  mixinToSkip[Ember.NAME_KEY] = 'MixinToSkip';

  let Inspected = Ember.Object.extend(mixinToSkip, {
    name: 'Teddy',
    gender: 'Male',
    hasChildren: false,
    expensiveProperty: computed(function() { return ''; }).property(),
    _debugInfo() {
      return {
        propertyInfo: {
          includeOtherProperties: true,
          skipProperties: ['propertyToSkip'],
          skipMixins: ['MixinToSkip'],
          expensiveProperties: ['expensiveProperty'],
          groups: [
            {
              name: 'Basic Info',
              properties: ['name', 'gender'],
              expand: true
            },
            {
              name: 'Family Info',
              properties: ['maritalStatus']
            }
          ]
        }
      };
    }
  });

  Inspected.toString = function() {
    return 'TestObject';
  };

  let inspected = Inspected.create({
    maritalStatus: 'Single',
    propertyToSkip: null
  });

  objectInspector.sendObject(inspected);

  assert.equal(message.details[0].name, 'Basic Info');
  assert.equal(message.details[0].properties[0].name, 'name');
  assert.equal(message.details[0].properties[1].name, 'gender');
  assert.ok(message.details[0].expand);

  assert.equal(message.details[1].name, 'Family Info');
  assert.equal(message.details[1].properties[0].name, 'maritalStatus');

  assert.equal(message.details[2].name, 'Own Properties');
  assert.equal(message.details[2].properties.length, 0, "Correctly skips properties");

  assert.equal(message.details[3].name, 'TestObject');
  assert.equal(message.details[3].properties.length, 2, "Does not duplicate properties");
  assert.equal(message.details[3].properties[0].name, 'hasChildren');
  assert.equal(message.details[3].properties[1].value.type, 'type-descriptor', "Does not calculate expensive properties");

  assert.ok(message.details[4].name !== 'MixinToSkip', "Correctly skips properties");

});

test("Read Only Computed properties mush have a readOnly property", function(assert) {
  let inspected = Ember.Object.extend({
    readCP: computed(function() {}).property().readOnly(),
    writeCP: computed(function() {}).property()
  }).create();

  objectInspector.sendObject(inspected);

  let properties = message.details[1].properties;

  assert.ok(properties[0].readOnly);
  assert.ok(!properties[1].readOnly);
});

test("Views are correctly handled when destroyed during transitions", async function(assert) {
  let objectId = null;

  await visit('/simple');

  objectId = find('.simple-view').get(0).id;
  let view = App.__container__.lookup('-view-registry:main')[objectId];
  objectInspector.sendObject(view);
  await wait();

  assert.ok(!!objectInspector.sentObjects[objectId], "Object successfully retained.");

  await visit('/');

  assert.ok(true, "No exceptions thrown");
});

test("Objects are dropped on destruction", async function(assert) {
  let didDestroy = false;
  let object = Ember.Object.create({
    willDestroy() {
      didDestroy = true;
    }
  });
  let objectId = guidFor(object);

  await wait();

  objectInspector.sendObject(object);
  await wait();

  assert.ok(!!objectInspector.sentObjects[objectId]);
  Ember.run(object, 'destroy');
  await wait();

  assert.ok(didDestroy, 'Original willDestroy is preserved.');
  assert.ok(!objectInspector.sentObjects[objectId], 'Object is dropped');
  assert.equal(name, 'objectInspector:droppedObject');
  assert.deepEqual(message, { objectId });

});

test("Properties ending with `Binding` are skipped", async function(assert) {
  let object = Ember.Object.create({
    bar: 'test',
    fooBinding: 'bar'
  });

  await wait();

  objectInspector.sendObject(object);
  await wait();

  let props = message.details[0].properties;
  assert.equal(props.length, 2, "Props should be foo and bar without fooBinding");
  assert.equal(props[0].name, 'bar');
  assert.equal(props[1].name, 'foo');
});

test("Properties listed in _debugInfo but don't exist should be skipped silently", async function(assert) {
  let object = Ember.Object.create({
    foo: 'test',
    _debugInfo() {
      return {
        propertyInfo: {
          groups: [{
            name: 'Attributes', properties: ['foo', 'bar']
          }]
        }
      };
    }

  });

  await wait();

  run(objectInspector, 'sendObject', object);
  await wait();

  let props = message.details[0].properties;
  assert.equal(props.length, 1, "bar should be silently skipped");
  assert.equal(props[0].name, 'foo');
});

test("Errors while computing CPs are handled", async function(assert) {
  // catch error port messages (ignored by default)
  ignoreErrors = false;

  let count = 0;
  let object;
  run(() => {
    object = EmberObject.extend({
      foo: computed(() => {
        if (count++ < 2) {
          throw new Error('CP Calculation');
        }
        return 'bar';
      })
    }).create();
  });

  run(objectInspector, 'sendObject', object);
  await wait();

  let errors = message.errors;
  assert.equal(errors.length, 1);
  assert.equal(errors[0].property, 'foo');
  ignoreErrors = false;

  // Calculate CP a second time
  run(() => {
    port.trigger('objectInspector:calculate', {
      objectId: guidFor(object),
      property: 'foo',
      mixinIndex: 1
    });
  });
  await wait();
  ignoreErrors = true;
  assert.equal(name, 'objectInspector:updateErrors');
  assert.equal(errors.length, 1);
  assert.equal(errors[0].property, 'foo');

  // Calculate CP a third time (no error this time)
  run(() => {
    port.trigger('objectInspector:calculate', {
      objectId: guidFor(object),
      property: 'foo',
      mixinIndex: 1
    });
  });
  await wait();
  assert.equal(name, 'objectInspector:updateProperty');
  assert.equal(message.value.inspect, 'bar');

  // teardown
  ignoreErrors = true;
});
