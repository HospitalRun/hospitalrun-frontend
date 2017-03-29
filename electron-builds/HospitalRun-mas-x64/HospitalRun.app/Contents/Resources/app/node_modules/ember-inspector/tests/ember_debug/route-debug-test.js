import Ember from "ember";
import { module, test } from 'qunit';
const { run, Application, Route } = Ember;
const get = Ember.get;

/* globals require */
const EmberDebug = require('ember-debug/main').default;
let port;
let App;

function setupApp() {
  App = Application.create();
  App.toString = function() { return 'App'; };
  App.setupForTesting();
  App.injectTestHelpers();

  App.Router.map(function() {
    this.route('simple');
    this.route('posts', { resetNamespace: true });
    this.route('comments', { resetNamespace: true }, function() {
      this.route('new');
      this.route('edit', { path: '/edit/:comment_id' });
    });
  });

  App.LoadingRoute = App.ErrorRoute = Route;
}

function getChildrenProperty(route, prop) {
  return route.children.map(item => get(item.value, prop));
}

module("Route Tree Debug", {
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
    EmberDebug.get('generalDebug').reopen({
      emberCliConfig: null
    });
    port = EmberDebug.port;
  },
  afterEach() {
    EmberDebug.destroyContainer();
    run(App, 'destroy');
  }
});

test("Route tree", async function t(assert) {
  let name = null, message = null, route;
  port.reopen({
    send(n, m) {
      name = n;
      message = m;
    }
  });

  await visit('/');

  run(port, 'trigger', 'route:getTree');
  await wait();

  assert.equal(name, 'route:routeTree');

  route = message.tree.children[0];
  assert.equal(route.value.name, 'application');
  assert.equal(route.value.type, 'resource');
  assert.equal(route.value.controller.name, 'application');
  assert.equal(route.value.controller.className, 'ApplicationController');
  assert.equal(route.value.routeHandler.name, 'application');
  assert.equal(route.value.routeHandler.className, 'ApplicationRoute');
  assert.equal(route.value.template.name, 'application');
  assert.equal(route.children.length, 6);

  assert.deepEqual(getChildrenProperty(route, 'name'), ['loading', 'error', 'simple', 'posts', 'comments', 'index']);

  let commentsRoute = route.children.filter(function(child) {
    return child.value.name === 'comments';
  })[0];

  assert.ok(commentsRoute, 'expected comment steps');

  assert.equal(commentsRoute.children.length, 3);
  assert.equal(commentsRoute.value.type, 'resource');
  assert.equal(commentsRoute.value.controller.className, 'CommentsController');
  assert.equal(commentsRoute.value.routeHandler.className, 'CommentsRoute');

  assert.deepEqual(getChildrenProperty(commentsRoute, 'name'), ['comments.new', 'comments.edit', 'comments.index']);

  assert.deepEqual(getChildrenProperty(commentsRoute, 'url'), ['/comments/new', '/comments/edit/:comment_id', '/comments']);
  assert.deepEqual(getChildrenProperty(commentsRoute, 'type'), ['route', 'route', 'route']);
  assert.deepEqual(getChildrenProperty(commentsRoute, 'controller.className'), ['CommentsNewController', 'CommentsEditController', 'CommentsIndexController']);
  assert.deepEqual(getChildrenProperty(commentsRoute, 'routeHandler.className'), ['CommentsNewRoute', 'CommentsEditRoute', 'CommentsIndexRoute']);
  assert.deepEqual(getChildrenProperty(commentsRoute, 'template.name'), ['comments/new', 'comments/edit', 'comments/index']);
});
