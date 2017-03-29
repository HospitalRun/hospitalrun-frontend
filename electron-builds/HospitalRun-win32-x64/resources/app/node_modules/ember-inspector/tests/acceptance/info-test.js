import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
let App;

let port;

module('Info Tab', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
    port.reopen({
      send(name) {
        if (name === 'general:getLibraries') {
          this.trigger('general:libraries', {
            libraries: [
              { name: 'Ember', version: '1.0' },
              { name: 'Handlebars', version: '2.1' }
            ]
          });
        }
      }
    });
  },
  afterEach() {
    Ember.run(App, App.destroy);
  }
});

test("Libraries are displayed correctly", async function t(assert) {
  let infoRoute = App.__container__.lookup('route:info');
  infoRoute.reopen({
    version: '9.9.9'
  });

  await visit('/info');

  let libraries = find('.js-library-row');
  assert.equal(libraries.length, 3, "The correct number of libraries is displayed");
  assert.equal(find('.js-lib-name', libraries[0]).text().trim(), 'Ember Inspector', 'Ember Inspector is added automatically');
  assert.equal(find('.js-lib-version', libraries[0]).text().trim(), '9.9.9');
  assert.equal(find('.js-lib-name', libraries[1]).text().trim(), 'Ember');
  assert.equal(find('.js-lib-version', libraries[1]).text().trim(), '1.0');
  assert.equal(find('.js-lib-name', libraries[2]).text().trim(), 'Handlebars');
  assert.equal(find('.js-lib-version', libraries[2]).text().trim(), '2.1');
});
