import Ember from "ember";
import { module, test } from 'qunit';

/* globals require */
const EmberDebug = require('ember-debug/main').default;
const { run, Application, Handlebars: { compile } } = Ember;
let port, App;


function setupApp() {
  App = Application.create();
  App.setupForTesting();
  App.injectTestHelpers();

  App.Router.map(function() {
    this.route('simple');
  });
  Ember.TEMPLATES.simple = compile('Simple template');
}

module("Render Debug", {
  beforeEach() {
    EmberDebug.Port = EmberDebug.Port.extend({
      init() {},
      send() {}
    });
    run(function() {
      setupApp();
      EmberDebug.set('application', App);
    });
    run(EmberDebug, 'start');
    port = EmberDebug.port;
  },
  afterEach() {
    EmberDebug.destroyContainer();
    run(App, 'destroy');
  }
});

test("Simple Render", async function t(assert) {
  let profiles = [];
  port.reopen({
    send(n, m) {
      if (n === "render:profilesAdded") {
        profiles = profiles.concat(m.profiles);
      }
    }
  });
  port.trigger('render:watchProfiles');

  await visit('/simple');

  assert.ok(profiles.length > 0, "it has created profiles");
});

test("Clears correctly", async function t(assert) {
  let profiles = [];

  port.reopen({
    send(n, m) {
      if (n === "render:profilesAdded") {
        profiles.push(m.profiles);
      }
      if (n === "render:profilesUpdated") {
        profiles = m.profiles;
      }
    }
  });

  port.trigger('render:watchProfiles');

  await visit('/simple');

  assert.ok(profiles.length > 0, "it has created profiles");
  port.trigger('render:clear');
  await wait();

  assert.ok(profiles.length === 0, "it has cleared the profiles");

});
