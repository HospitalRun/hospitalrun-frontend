import Ember from "ember";
import { module, test } from 'qunit';
const { $, Application } = Ember;

/* globals require */
const EmberDebug = require('ember-debug/main').default;
const { Route, Object: EmberObject, Handlebars, Controller } = Ember;
const { compile } = Handlebars;
let port;
let App, run = Ember.run;
let OLD_TEMPLATES = {};

function setTemplate(name, template) {
  OLD_TEMPLATES = Ember.TEMPLATES[name];
  Ember.TEMPLATES[name] = compile(template, { moduleName: name });
}

function destroyTemplates() {
  for (let name in OLD_TEMPLATES) {
    Ember.TEMPLATES[name] = OLD_TEMPLATES[name];
  }
  OLD_TEMPLATES = {};
}

function setupApp() {
  App = Application.create();
  App.setupForTesting();
  App.injectTestHelpers();


  App.Router.map(function() {
    this.route('simple');
    this.route('comments', { resetNamespace: true }, function() {});
    this.route('posts', { resetNamespace: true });
  });

  App.ApplicationRoute = Route.extend({
    model() {
      return EmberObject.create({
        toString() {
          return 'Application model';
        }
      });
    }
  });

  App.SimpleRoute = Route.extend({
    model() {
      return EmberObject.create({
        toString() {
          return 'Simple Model';
        }
      });
    }
  });

  App.CommentsIndexRoute = Route.extend({
    model() {
      return Ember.A(['first comment', 'second comment', 'third comment']);
    }
  });

  App.PostsRoute = Route.extend({
    model() {
      return 'String as model';
    }
  });

  App.ApplicationController = Controller.extend();
  App.ApplicationController.reopenClass({
    toString() {
      return 'App.ApplicationController';
    }
  });
  App.SimpleController = Controller.extend();
  App.SimpleController.reopenClass({
    toString() {
      return 'App.SimpleController';
    }
  });

  setTemplate('application', '<div class="application">{{outlet}}</div>');
  setTemplate('simple', 'Simple {{input class="simple-input"}}');
  setTemplate('comments/index', '{{#each}}{{this}}{{/each}}');
  setTemplate('posts', 'Posts');
}

module("View Debug", {
  beforeEach() {
    EmberDebug.Port = EmberDebug.Port.extend({
      init() {},
      send() {}
    });
    run(function() {
      setupApp();
      EmberDebug.set('application', App);
    });
    EmberDebug.IGNORE_DEPRECATIONS = true;
    run(EmberDebug, 'start');
    port = EmberDebug.port;
  },
  afterEach() {
    EmberDebug.destroyContainer();
    run(App, 'destroy');
    destroyTemplates();
  }
});

test("Simple View Tree", async function t(assert) {
  let name = null, message = null;
  port.reopen({
    send(n, m) {
      name = n;
      message = m;
    }
  });

  await visit('/simple');

  assert.equal(name, 'view:viewTree');
  let tree = message.tree;
  let value = tree.value;
  assert.equal(tree.children.length, 1);
  assert.equal(value.controller.name, 'App.ApplicationController');
  assert.equal(value.viewClass, '(unknown mixin)');
  assert.equal(value.name, 'application');
  assert.equal(value.tagName, 'div');
  assert.equal(value.template, 'application');
});

test("Components in view tree", async function t(assert) {
  let message;
  port.reopen({
    send(n, m) {
      message = m;
    }
  });

  await visit('/simple');

  let tree = message.tree;
  let simple = tree.children[0];
  assert.equal(simple.children.length, 0, "Components are not listed by default.");
  run(() => {
    port.trigger('view:setOptions', { options: { components: true } });
  });

  await wait();

  tree = message.tree;
  simple = tree.children[0];
  assert.equal(simple.children.length, 1, "Components can be configured to show.");
  let component = simple.children[0];
  assert.equal(component.value.viewClass, 'Ember.TextField');

});

test("Highlighting Views on hover", async function t(assert) {
  let name, message;
  port.reopen({
    send(n, m) {
      name = n;
      message = m;
    }
  });

  await visit('/simple');

  run(() => port.trigger('view:inspectViews', { inspect: true }));
  await wait();

  run(() => find('.application').trigger('mousemove'));
  await wait();

  let previewDiv = find('[data-label=preview-div]');
  assert.ok(previewDiv.is(':visible'));
  assert.equal(find('[data-label=layer-component]').length, 0, "Component layer not shown on outlet views");
  assert.equal(find('[data-label=layer-controller]', previewDiv).text(), 'App.ApplicationController');
  assert.equal(find('[data-label=layer-model]', previewDiv).text(), 'Application model');
  assert.equal(find('[data-label=layer-view]', previewDiv).text(), '(unknown mixin)');

  let layerDiv = find('[data-label=layer-div]');
  run(() => previewDiv.trigger('mouseup'));
  await wait();

  assert.ok(layerDiv.is(':visible'));
  assert.equal(find('[data-label=layer-model]', layerDiv).text(), 'Application model');
  assert.equal(find('[data-label=layer-view]', layerDiv).text(), '(unknown mixin)');
  await click('[data-label=layer-controller]', layerDiv);

  let controller = App.__container__.lookup('controller:application');
  assert.equal(name, 'objectInspector:updateObject');
  assert.equal(controller.toString(), message.name);
  name = null;
  message = null;

  await click('[data-label=layer-model]', layerDiv);

  assert.equal(name, 'objectInspector:updateObject');
  assert.equal(message.name, 'Application model');

  await click('[data-label=layer-close]');

  assert.ok(!layerDiv.is(':visible'));

  run(() => port.trigger('view:inspectViews', { inspect: true }));
  await wait();

  run(() => find('.simple-input').trigger('mousemove'));
  await wait();

  previewDiv = find('[data-label=preview-div]');
  assert.ok(previewDiv.is(':visible'));
  assert.equal(find('[data-label=layer-component]').text().trim(), "Ember.TextField");
  assert.equal(find('[data-label=layer-controller]', previewDiv).length, 0);
  assert.equal(find('[data-label=layer-model]', previewDiv).length, 0);
});

test("Highlighting a view without an element should not throw an error", async function t(assert) {
  let message = null;
  port.reopen({
    send(n, m) {
      message = m;
    }
  });

  await visit('/posts');

  let tree = message.tree;
  let postsView = tree.children[0];
  port.trigger('view:previewLayer', { objectId: postsView.value.objectId });
  await wait();

  assert.ok(true, "Does not throw an error.");
});

test("Supports a view with a string as model", async function t(assert) {
  let message = null;
  port.reopen({
    send(n, m) {
      message = m;
    }
  });

  await visit('/posts');

  assert.equal(message.tree.children[0].value.model.name, 'String as model');
  assert.equal(message.tree.children[0].value.model.type, 'type-string');
});

test("Supports applications that don't have the ember-application CSS class", async function t(assert) {
  let name = null;
  let $rootElement = $('body');

  await visit('/simple');

  assert.ok($rootElement.hasClass('ember-application'), "The rootElement has the .ember-application CSS class");
  $rootElement.removeClass('ember-application');

  // Restart the inspector
  EmberDebug.start();
  port = EmberDebug.port;

  port.reopen({
    send(n/*, m*/) {
      name = n;
    }
  });

  await visit('/simple');

  assert.equal(name, 'view:viewTree');
});

test("Does not list nested {{yield}} views", async function t(assert) {
  let message = null;
  port.reopen({
    send(n, m) {
      message = m;
    }
  });

  setTemplate('posts', '{{#x-first}}Foo{{/x-first}}');
  setTemplate('components/x-first', '{{#x-second}}{{yield}}{{/x-second}}');
  setTemplate('components/x-second', '{{yield}}');

  await visit('/posts');

  assert.equal(message.tree.children.length, 1, 'Only the posts view should render');
  assert.equal(message.tree.children[0].children.length, 0, 'posts view should have no children');
});
