import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
let App;

let port, message, name;

function deprecationsWithSource() {
  return [{
    count: 2,
    hasSourceMap: true,
    sources: [{
      stackStr: 'stack-trace',
      map: {
        source: 'path-to-file.js',
        line: 1,
        fullSource: 'http://path-to-file.js'
      }
    }, {
      stackStr: 'stack-trace-2',
      map: {
        source: 'path-to-second-file.js',
        line: 2,
        fullSource: 'http://path-to-second-file.js'
      }
    }],
    message: 'Deprecation 1',
    url: 'http://www.emberjs.com'
  }];
}

module('Deprecation Tab', {
  beforeEach() {
    App = startApp({ adapter: 'basic' });
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

test('No source map', async function(assert) {
  port.reopen({
    send(name) {
      if (name === 'deprecation:watch') {
        port.trigger('deprecation:deprecationsAdded', {
          deprecations: [{
            count: 2,
            sources: [{
              stackStr: 'stack-trace',
              map: null
            }, {
              stackStr: 'stack-trace-2',
              map: null
            }],
            message: 'Deprecation 1',
            url: 'http://www.emberjs.com'
          }]
        });
      }
      return this._super(...arguments);
    }
  });

  await visit('/deprecations');

  assert.equal(find('.js-deprecation-source:first').length, 0, 'no sources');
  assert.equal(find('.js-deprecation-message:first').text().trim(), 'Deprecation 1', 'message shown');
  assert.equal(find('.js-deprecation-count:first').text().trim(), 2, 'Count correct');
  assert.equal(find('.js-deprecation-full-trace:first').length, 1, 'Full trace button shown');
  await click('.js-full-trace-deprecations-btn:first');

  assert.equal(name, 'deprecation:sendStackTraces');
  assert.equal(message.deprecation.message, 'Deprecation 1');
  assert.equal(message.deprecation.sources.length, 2);
});

test("With source map, source found, can't open resource", async function(assert) {
  port.reopen({
    send(name) {
      if (name === 'deprecation:watch') {
        port.trigger('deprecation:deprecationsAdded', {
          deprecations: deprecationsWithSource()
        });
      }
      return this._super(...arguments);
    }
  });

  await visit('/deprecations');

  assert.equal(find('.js-deprecation-message:first').text().trim(), 'Deprecation 1', 'message shown');
  assert.equal(find('.js-deprecation-count:first').text().trim(), 2, 'Count correct');
  assert.equal(find('.js-deprecation-full-trace:first').length, 0, 'Full trace button not shown');

  let sources = find('.js-deprecation-source');
  assert.equal(sources.length, 2, 'shows all sources');
  assert.equal(find('.js-deprecation-source-link', sources[0]).length, 0, 'source not clickable');
  assert.equal(find('.js-deprecation-source-text', sources[0]).text().trim(), 'path-to-file.js:1');
  assert.equal(find('.js-deprecation-source-link', sources[1]).length, 0, 'source not clickable');
  assert.equal(find('.js-deprecation-source-text', sources[1]).text().trim(), 'path-to-second-file.js:2');

  await click('.js-trace-deprecations-btn', sources[0]);

  assert.equal(name, 'deprecation:sendStackTraces');
  assert.equal(message.deprecation.message, 'Deprecation 1');
  assert.equal(message.deprecation.sources.length, 1);

  await click('.js-trace-deprecations-btn', sources[1]);

  assert.equal(name, 'deprecation:sendStackTraces');
  assert.equal(message.deprecation.message, 'Deprecation 1');
  assert.equal(message.deprecation.sources.length, 1);

});

test("With source map, source found, can open resource", async function(assert) {
  let openResourceArgs = false;
  port.get('adapter').reopen({
    canOpenResource: true,
    openResource(...args) {
      openResourceArgs = args;
    }
  });
  port.reopen({
    send(name) {
      if (name === 'deprecation:watch') {
        port.trigger('deprecation:deprecationsAdded', {
          deprecations: deprecationsWithSource()
        });
      }
      return this._super(...arguments);
    }
  });

  await visit('/deprecations');

  assert.equal(find('.js-deprecation-message:first').text().trim(), 'Deprecation 1', 'message shown');
  assert.equal(find('.js-deprecation-count:first').text().trim(), 2, 'Count correct');
  assert.equal(find('.js-deprecation-full-trace:first').length, 0, 'Full trace button not shown');

  let sources = find('.js-deprecation-source');
  assert.equal(sources.length, 2, 'shows all sources');
  assert.equal(find('.js-deprecation-source-text', sources[0]).length, 0, 'source clickable');
  assert.equal(find('.js-deprecation-source-link', sources[0]).text().trim(), 'path-to-file.js:1');
  assert.equal(find('.js-deprecation-source-text', sources[1]).length, 0, 'source clickable');
  assert.equal(find('.js-deprecation-source-link', sources[1]).text().trim(), 'path-to-second-file.js:2');

  openResourceArgs = false;
  await click('.js-deprecation-source-link', sources[0]);

  assert.ok(openResourceArgs);
  openResourceArgs = false;

  await click('.js-deprecation-source-link', sources[1]);

  assert.ok(openResourceArgs);
  openResourceArgs = false;

  await click('.js-trace-deprecations-btn', sources[0]);

  assert.equal(name, 'deprecation:sendStackTraces');
  assert.equal(message.deprecation.message, 'Deprecation 1');
  assert.equal(message.deprecation.sources.length, 1);
  await click('.js-trace-deprecations-btn', sources[1]);
  assert.equal(name, 'deprecation:sendStackTraces');
  assert.equal(message.deprecation.message, 'Deprecation 1');
  assert.equal(message.deprecation.sources.length, 1);
});
