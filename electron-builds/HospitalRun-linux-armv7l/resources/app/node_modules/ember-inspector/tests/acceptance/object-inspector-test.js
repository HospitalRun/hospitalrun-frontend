import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
const { run } = Ember;
let App;
let port, message, name;


module('Object Inspector', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
    port.reopen({
      send(n, m) {
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

const objectAttr = {
  name: 'Object Name',
  objectId: 1,
  errors: [],
  details: [
    {
      name: 'Own Properties',
      expand: true,
      properties: [{
        name: 'id',
        value: 1
      }]
    }
  ]
};

function objectFactory(props) {
  return Ember.$.extend(true, {}, objectAttr, props);
}

function objectToInspect() {
  return objectFactory({
    name: 'My Object',
    objectId: 'objectId',
    errors: [],
    details: [
      {
        name: 'First Detail',
        expand: false,
        properties: [{
          name: 'numberProperty',
          value: {
            inspect: 1,
            value: 'type-number'
          }
        }]
      },
      {
        name: 'Second Detail',
        properties: [
          {
            name: 'objectProperty',
            value: {
              inspect: 'Ember Object Name',
              type: 'type-ember-object'
            }
          }, {
            name: 'stringProperty',
            value: {
              inspect: 'String Value',
              type: 'type-ember-string'
            }
          }
        ]
      }
    ]
  });
}

test("The object displays correctly", async function (assert) {
  let obj = objectFactory({ name: 'My Object' });
  await visit('/');

  await triggerPort('objectInspector:updateObject', obj);

  assert.equal(find('.js-object-name').text(), 'My Object');
  assert.equal(find('.js-object-detail-name').filter(':first').text(), 'Own Properties');
  assert.ok(find('.js-object-detail').hasClass('mixin_state_expanded'), 'The "Own Properties" detail is expanded by default');
});

test("Object details", async function (assert) {

  let $firstDetail, $secondDetail;

  await visit('/');

  await triggerPort('objectInspector:updateObject', objectToInspect());

  assert.equal(find('.js-object-name').text(), 'My Object');
  $firstDetail = find('.js-object-detail').eq(0);
  $secondDetail = find('.js-object-detail').eq(1);
  assert.equal(find('.js-object-detail-name', $firstDetail).text(), 'First Detail');
  assert.ok(!$firstDetail.hasClass('mixin_state_expanded'), 'Detail not expanded by default');

  await click('.js-object-detail-name', $firstDetail);

  assert.ok($firstDetail.hasClass('mixin_state_expanded'), 'Detail expands on click.');
  assert.ok(!$secondDetail.hasClass('mixin_state_expanded'), 'Second detail does not expand.');
  assert.equal(find('.js-object-property', $firstDetail).length, 1);
  assert.equal(find('.js-object-property-name', $firstDetail).text(), 'numberProperty');
  assert.equal(find('.js-object-property-value', $firstDetail).text(), '1');

  await click('.js-object-detail-name', $firstDetail);

  assert.ok(!$firstDetail.hasClass('mixin_state_expanded'), 'Expanded detail minimizes on click.');
  await click('.js-object-detail-name', $secondDetail);

  assert.ok($secondDetail.hasClass('mixin_state_expanded'));
  assert.equal(find('.js-object-property', $secondDetail).length, 2);
  assert.equal(find('.js-object-property-name', $secondDetail).eq(0).text(), 'objectProperty');
  assert.equal(find('.js-object-property-value', $secondDetail).eq(0).text(), 'Ember Object Name');
  assert.equal(find('.js-object-property-name', $secondDetail).eq(1).text(), 'stringProperty');
  assert.equal(find('.js-object-property-value', $secondDetail).eq(1).text(), 'String Value');
});

test("Digging deeper into objects", async function (assert) {
  let $secondDetail;

  await visit('/');

  triggerPort('objectInspector:updateObject', objectToInspect());

  $secondDetail = find('.js-object-detail').eq(1);
  await click('.js-object-detail-name', $secondDetail);

  let $objectProperty = find('.js-object-property').filter(':first');
  $objectProperty = find('.js-object-property-value', $objectProperty);
  await click($objectProperty);

  assert.equal(name, 'objectInspector:digDeeper');
  assert.deepEqual(message, { objectId: 'objectId', property: 'objectProperty' });

  let nestedObject = {
    parentObject: 'objectId',
    name: 'Nested Object',
    objectId: 'nestedObject',
    property: 'objectProperty',
    details: [{
      name: 'Nested Detail',
      properties: [{
        name: 'nestedProp',
        value: {
          inspect: 'Nested Prop',
          type: 'type-string'
        }
      }]
    }]
  };

  await triggerPort('objectInspector:updateObject', nestedObject);

  assert.equal(find('.js-object-name').text(), 'My Object', 'Title stays as the initial object.');
  assert.equal(find('.js-object-trail').text(), '.objectProperty', 'Nested property shows below title');
  assert.equal(find('.js-object-detail-name').text(), 'Nested Detail');
  await click('.js-object-detail-name');

  assert.ok(find('.js-object-detail').hasClass('mixin_state_expanded'));
  assert.equal(find('.js-object-property-name').text(), 'nestedProp');
  assert.equal(find('.js-object-property-value').text(), 'Nested Prop');
  await click('.js-object-inspector-back');

  assert.equal(find('.js-object-trail').length, 0);
});

test("Computed properties", async function (assert) {
  await visit('/');

  let obj = {
    name: 'My Object',
    objectId: 'myObject',
    details: [{
      name: 'Detail',
      properties: [{
        name: 'computedProp',
        value: {
          inspect: '<computed>',
          type: 'type-descriptor',
          computed: true
        }
      }]
    }]
  };

  await triggerPort('objectInspector:updateObject', obj);

  await click('.js-object-detail-name');
  await click('.js-calculate');

  assert.equal(name, 'objectInspector:calculate');
  assert.deepEqual(message, { objectId: 'myObject', property: 'computedProp', mixinIndex: 0 });
  await triggerPort('objectInspector:updateProperty', {
    objectId: 'myObject',
    property: 'computedProp',
    value: {
      inspect: 'Computed value'
    },
    mixinIndex: 0
  });

  assert.equal(find('.js-object-property-value').text(), 'Computed value');
});

test("Properties are bound to the application properties", async function (assert) {
  await visit('/');

  let obj = {
    name: 'My Object',
    objectId: 'object-id',
    details: [{
      name: 'Own Properties',
      expand: true,
      properties: [{
        name: 'boundProp',
        value: {
          inspect: 'Teddy',
          type: 'type-string',
          computed: false
        }
      }]

    }]
  };
  await triggerPort('objectInspector:updateObject', obj);

  assert.equal(find('.js-object-property-value').first().text(), 'Teddy');
  await triggerPort('objectInspector:updateProperty', {
    objectId: 'object-id',
    mixinIndex: 0,
    property: 'boundProp',
    value: {
      inspect: 'Alex',
      type: 'type-string',
      computed: false
    }
  });

  await click('.js-object-property-value');

  let txtField = find('.js-object-property-value-txt');
  assert.equal(txtField.val(), '"Alex"');
  await fillIn(txtField, '"Joey"');

  let e = Ember.$.Event('keyup', { keyCode: 13 });
  find('.js-object-property-value-txt').trigger(e);
  assert.equal(name, 'objectInspector:saveProperty');
  assert.equal(message.property, 'boundProp');
  assert.equal(message.value, 'Joey');
  assert.equal(message.mixinIndex, 0);

  await triggerPort('objectInspector:updateProperty', {
    objectId: 'object-id',
    mixinIndex: 0,
    property: 'boundProp',
    value: {
      inspect: 'Joey',
      type: 'type-string',
      computed: false
    }
  });

  assert.equal(find('.js-object-property-value').text(), 'Joey');
});

test("Stringified json should not get double parsed", async function (assert) {
  await visit('/');

  let obj = {
    name: 'My Object',
    objectId: 'object-id',
    details: [{
      name: 'Own Properties',
      expand: true,
      properties: [{
        name: 'boundProp',
        value: {
          inspect: '{"name":"teddy"}',
          type: 'type-string',
          computed: false
        }
      }]

    }]
  };
  await triggerPort('objectInspector:updateObject', obj);

  await click('.js-object-property-value');

  let txtField = find('.js-object-property-value-txt');
  assert.equal(txtField.val(), '"{"name":"teddy"}"');
  await fillIn(txtField, '"{"name":"joey"}"');

  let e = Ember.$.Event('keyup', { keyCode: 13 });
  find('.js-object-property-value-txt').trigger(e);
  assert.equal(name, 'objectInspector:saveProperty');
  assert.equal(message.property, 'boundProp');
  assert.equal(message.value, '{"name":"joey"}');
  assert.equal(message.mixinIndex, 0);
});

test("Send to console", async function (assert) {
  await visit('/');

  let obj = {
    name: 'My Object',
    objectId: 'object-id',
    details: [{
      name: 'Own Properties',
      expand: true,
      properties: [{
        name: 'myProp',
        value: {
          inspect: 'Teddy',
          type: 'type-string',
          computed: false
        }
      }]

    }]
  };
  await triggerPort('objectInspector:updateObject', obj);

  await click('.js-send-to-console-btn');

  assert.equal(name, 'objectInspector:sendToConsole');
  assert.equal(message.objectId, 'object-id');
  assert.equal(message.property, 'myProp');

  await click('.js-send-object-to-console-btn');

  assert.equal(name, 'objectInspector:sendToConsole');
  assert.equal(message.objectId, 'object-id');
  assert.equal(message.property, undefined);
});

test("Read only CPs cannot be edited", async function (assert) {
  await visit('/');

  let obj = {
    name: 'My Object',
    objectId: 'object-id',
    details: [{
      name: 'Own Properties',
      expand: true,
      properties: [{
        name: 'readCP',
        readOnly: true,
        value: {
          computed: true,
          inspect: 'Read',
          type: 'type-string'
        }
      }, {
        name: 'readCP',
        readOnly: false,
        value: {
          computed: true,
          inspect: 'Write',
          type: 'type-string'
        }
      }]
    }]
  };
  await triggerPort('objectInspector:updateObject', obj);
  await click(find('.js-object-property-value').first());
  assert.equal(find('.js-object-property-value-txt').length, 0);

  await click(find('.js-object-property-value').last());

  assert.equal(find('.js-object-property-value-txt').length, 1);
});

test("Dropping an object due to destruction", async function (assert) {
  await visit('/');

  let obj = {
    name: 'My Object',
    objectId: 'myObject',
    details: [{
      name: 'Detail',
      properties: []
    }]
  };

  await triggerPort('objectInspector:updateObject', obj);

  assert.equal(find('.js-object-name').text().trim(), 'My Object');
  await triggerPort('objectInspector:droppedObject', { objectId: 'myObject' });

  assert.equal(find('.js-object-name').text().trim(), '');
});

test("Date fields are editable", async function (assert) {
  await visit('/');

  let date = new Date();

  let obj = {
    name: 'My Object',
    objectId: 'myObject',
    details: [{
      name: 'First Detail',
      expand: false,
      properties: [{
        name: 'dateProperty',
        value: {
          inspect: date.toString(),
          type: 'type-date'
        }
      }]
    }]
  };
  await triggerPort('objectInspector:updateObject', obj);
  assert.ok(true);

  await click('.js-object-detail-name');

  await click('.js-object-property-value:first');

  let field = find('.js-object-property-value-date');
  assert.equal(field.length, 1);
  await fillIn(field, '2015-01-01');

  // pickaday.js needs this
  run(find('.js-object-property-value-date'), 'change');

  await wait();

  let e = Ember.$.Event('keyup', { keyCode: 13 });
  run(() => {
    find('.js-object-property-value-date').trigger(e);
  });
  await wait();

  assert.equal(name, 'objectInspector:saveProperty');
  assert.equal(message.property, 'dateProperty');
  assert.equal(message.dataType, 'date');

  let newDate = new Date(message.value);
  assert.equal(newDate.getMonth(), 0);
  assert.equal(newDate.getDate(), 1);
  assert.equal(newDate.getFullYear(), 2015);
});

test("Errors are correctly displayed", async function (assert) {
  let obj = objectFactory({
    name: 'My Object',
    objectId: '1',
    errors: [
      { property: 'foo' },
      { property: 'bar' }
    ]
  });
  await visit('/');
  await triggerPort('objectInspector:updateObject', obj);

  assert.equal(find('.js-object-name').text(), 'My Object');
  assert.equal(find('.js-object-inspector-errors').length, 1);
  assert.equal(find('.js-object-inspector-error').length, 2);

  await click('.js-send-errors-to-console');

  assert.equal(name, 'objectInspector:traceErrors');
  assert.equal(message.objectId, '1');

  await triggerPort('objectInspector:updateErrors', {
    objectId: '1',
    errors: [
      { property: 'foo' }
    ]
  });

  assert.equal(find('.js-object-inspector-error').length, 1);

  await triggerPort('objectInspector:updateErrors', {
    objectId: '1',
    errors: []
  });

  assert.equal(find('.js-object-inspector-errors').length, 0);
});
