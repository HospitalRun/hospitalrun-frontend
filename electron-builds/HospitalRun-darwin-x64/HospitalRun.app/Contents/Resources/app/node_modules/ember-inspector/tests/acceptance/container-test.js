import Ember from "ember";
import { module } from 'qunit';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
let App;

let port, message, name;

module('Container Tab', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
  },
  afterEach() {
    name = null;
    message = null;
    Ember.run(App, App.destroy);
  }
});


function getTypes() {
  return [
    {
      name: 'route',
      count: 5
    },
    {
      name: 'controller',
      count: 2
    }
  ];
}

function getInstances() {
  return [
    {
      name: 'first',
      inspectable: false
    },
    {
      name: 'second',
      inspectable: true
    }
  ];
}

test("Container types are successfully listed", async function(assert) {
  port.reopen({
    send(name) {
      if (name === 'container:getTypes') {
        this.trigger('container:types', { types: getTypes() });
      }
    }
  });

  await visit('/container-types');
  let rows = find('.js-container-type');
  assert.equal(rows.length, 2);
  assert.equal(find('.js-container-type-name', rows[0]).text().trim(), 'controller');
  assert.equal(find('.js-container-type-count', rows[0]).text().trim(), '2');
  assert.equal(find('.js-container-type-name', rows[1]).text().trim(), 'route');
  assert.equal(find('.js-container-type-count', rows[1]).text().trim(), '5');
});


test("Container instances are successfully listed", async function(assert) {
  let instances = getInstances();

  port.reopen({
    send(n, m) {
      name = n;
      message = m;
      if (name === 'container:getTypes') {
        this.trigger('container:types', { types: getTypes() });
      }

      if (name === 'container:getInstances' && message.containerType === 'controller') {
        this.trigger('container:instances', { instances, status: 200 });
      }
    }
  });

  await visit('/container-types/controller');
  let rows;

  rows = find('.js-container-instance-list-item');

  find(rows.length, 2);
  assert.equal(rows.eq(0).text().trim(), 'first');
  assert.equal(rows.eq(1).text().trim(), 'second');
  name = null;
  message = null;

  await click(rows[0]);

  assert.equal(name, null);
  await click(rows[1]);

  assert.equal(name, 'objectInspector:inspectByContainerLookup');

  await fillIn(find('.js-container-instance-search').find('input'), 'first');

  rows = find('.js-container-instance-list-item');
  assert.equal(rows.length, 1);
  assert.equal(rows.eq(0).text().trim(), 'first');

});

test("Successfully redirects if the container type is not found", async function(assert) {

  port.reopen({
    send(n, m) {
      name = n;
      message = m;
      if (name === 'container:getTypes') {
        this.trigger('container:types', { types: getTypes() });
      }

      if (name === 'container:getInstances' && message.containerType === 'random-type') {
        this.trigger('container:instances', { status: 404 });
      }
    }
  });
  let adapterException = Ember.Test.adapter.exception;
  // Failed route causes a promise unhandled rejection
  // even though there's an `error` action defined :(
  Ember.Test.adapter.exception = err => {
    if (!err || err.status !== 404) {
      return adapterException.call(Ember.Test.adapter, err);
    }
  };
  await visit('/container-types/random-type');
  assert.equal(currentURL(), '/container-types');
  Ember.Test.adapter.exception = adapterException;
});

test("Reload", async function(assert) {
  let types = [], instances = [];

  port.reopen({
    send(n, m) {
      if (n === 'container:getTypes') {
        this.trigger('container:types', { types });
      }
      if (n === 'container:getInstances' && m.containerType === 'controller') {
        this.trigger('container:instances', { instances, status: 200 });
      }
    }
  });

  await visit('/container-types/controller');

  assert.equal(find('.js-container-type').length, 0);
  assert.equal(find('.js-container-instance-list-item').length, 0);
  types = getTypes();
  instances = getInstances();

  await click('.js-reload-container-btn');

  assert.equal(find('.js-container-type').length, 2);
  assert.equal(find('.js-container-instance-list-item').length, 2);
});
