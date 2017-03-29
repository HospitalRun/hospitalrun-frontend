import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
let App;
const { run } = Ember;

let port;

module('View Tree Tab', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
  },
  afterEach() {
    Ember.run(App, App.destroy);
  }
});

let treeId = 0;
function viewNodeFactory(props) {
  if (!props.template) {
    props.template = props.name;
  }
  let obj = {
    value: props,
    children: [],
    treeId: ++treeId
  };
  return obj;
}

function viewTreeFactory(tree) {
  let children = tree.children;
  delete tree.children;
  let viewNode = viewNodeFactory(tree);
  if (children) {
    for (let i = 0; i < children.length; i++) {
      viewNode.children.push(viewTreeFactory(children[i]));
    }
  }
  return viewNode;
}

function defaultViewTree() {
  return viewTreeFactory({
    name: 'application',
    isVirtual: false,
    isComponent: false,
    objectId: 'applicationView',
    viewClass: 'App.ApplicationView',
    completeViewClass: 'App.ApplicationView',
    duration: 10,
    controller: {
      name: 'App.ApplicationController',
      completeName: 'App.ApplicationController',
      objectId: 'applicationController'
    },
    children: [
      {
        name: 'posts',
        isVirtual: false,
        isComponent: false,
        viewClass: 'App.PostsView',
        completeViewClass: 'App.PostsView',
        duration: 1,
        objectId: 'postsView',
        model: {
          name: 'PostsArray',
          completeName: 'PostsArray',
          objectId: 'postsArray',
          type: 'type-ember-object'
        },
        controller: {
          name: 'App.PostsController',
          completeName: 'App.PostsController',
          objectId: 'postsController'
        },
        children: []
      },
      {
        name: 'comments',
        isVirtual: false,
        isComponent: false,
        viewClass: 'App.CommentsView',
        completeViewClass: 'App.CommentsView',
        duration: 2.5,
        objectId: 'commentsView',
        model: {
          name: 'CommentsArray',
          completeName: 'CommentsArray',
          objectId: 'commentsArray',
          type: 'type-ember-object'
        },
        controller: {
          name: 'App.CommentsController',
          completeName: 'App.CommentsController',
          objectId: 'commentsController'
        },
        children: []
      }
    ]
  });
}

test("It should correctly display the view tree", async function(assert) {
  let viewTree = defaultViewTree();

  await visit('/');
  run(() => {
    port.trigger('view:viewTree', { tree: viewTree });
  });
  await wait();

  let $treeNodes = find('.js-view-tree-item');
  assert.equal($treeNodes.length, 3, 'expected some tree nodes');
  let controllerNames = [];
  let templateNames = [];
  let modelNames = [];
  let viewClassNames = [];
  let durations = [];

  function textFor(selector, context) {
    return find(selector, context).filter(':first').text().trim();
  }

  $treeNodes.each(function() {
    templateNames.push(textFor('.js-view-template', this));
    controllerNames.push(textFor('.js-view-controller', this));
    viewClassNames.push(textFor('.js-view-class', this));
    modelNames.push(textFor('.js-view-model', this));
    durations.push(textFor('.js-view-duration', this));
  });

  assert.deepEqual(controllerNames, [
    'App.ApplicationController',
    'App.PostsController',
    'App.CommentsController'
  ], 'expected controller names');

  assert.deepEqual(templateNames, [
    'application',
    'posts',
    'comments'
  ], 'expected template names');

  assert.deepEqual(modelNames, [
    '--',
    'PostsArray',
    'CommentsArray'
  ], 'expected model names');

  assert.deepEqual(viewClassNames, [
    'App.ApplicationView',
    'App.PostsView',
    'App.CommentsView'
  ], 'expected view class names');

  assert.deepEqual(durations, [
    '10.00ms',
    '1.00ms',
    '2.50ms'
  ], 'expected render durations');

  let titleTips = find('span[title]').toArray().map(node => node.getAttribute('title')).sort();

  assert.deepEqual(titleTips, [
    'App.ApplicationController',
    'App.ApplicationView',
    'App.CommentsController',
    'App.CommentsView',
    'App.PostsController',
    'App.PostsView',
    'CommentsArray',
    'PostsArray',
    'application',
    'application',
    'comments',
    'comments',
    'posts',
    'posts'
  ], 'expected title tips');
});

test("It should update the view tree when the port triggers a change", async function(assert) {
  assert.expect(4);
  let $treeNodes, viewTree = defaultViewTree();

  await visit('/');
  run(() => port.trigger('view:viewTree', { tree: viewTree }));
  await wait();

  $treeNodes = find('.js-view-tree-item');
  assert.equal($treeNodes.length, 3);
  assert.equal(find('.js-view-controller').filter(':last').text().trim(), 'App.CommentsController');

  viewTree = defaultViewTree();
  viewTree.children.splice(0, 1);
  viewTree.children[0].value.controller.name = 'App.SomeController';
  run(() => port.trigger('view:viewTree', { tree: viewTree }));
  await wait();
  $treeNodes = find('.js-view-tree-item');
  assert.equal($treeNodes.length, 2);
  assert.equal(find('.js-view-controller').filter(':last').text().trim(), 'App.SomeController');
});

test("Previewing / showing a view on the client", async function(assert) {
  let messageSent = null;
  port.reopen({
    send(name, message) {
      messageSent = { name, message };
    }
  });

  await visit('/');
  let viewTree = defaultViewTree();
  viewTree.children = [];
  run(() => port.trigger('view:viewTree', { tree: viewTree }));
  await wait();
  run(() => find('.js-view-tree-item').mouseenter());
  await wait();
  assert.equal(messageSent.name, 'view:previewLayer', "Client asked to preview layer");
  assert.equal(messageSent.message.objectId, 'applicationView', "Client sent correct id to preview layer");
  run(() => find('.js-view-tree-item').mouseleave());
  await wait();
  assert.equal(messageSent.name, 'view:hidePreview', "Client asked to hide preview");
});

test("Inspecting views on hover", async function(assert) {
  let messageSent = null;
  port.reopen({
    send(name, message) {
      messageSent = { name, message };
    }
  });

  await visit('/');
  await click('.js-inspect-views');
  assert.equal(messageSent.name, 'view:inspectViews');
  assert.deepEqual(messageSent.message, { inspect: true });
  run(() => port.trigger('view:startInspecting'));
  await wait();
  await click('.js-inspect-views');
  assert.equal(messageSent.name, 'view:inspectViews');
  assert.deepEqual(messageSent.message, { inspect: false });
});

test("Configuring which views to show", async function(assert) {
  let messageSent = null;
  port.reopen({
    send(name, message) {
      messageSent = { name, message };
    }
  });

  await visit('/');
  let checkbox = find('.js-filter-components input');
  checkbox.prop('checked', true);
  checkbox.trigger('change');
  await wait();
  assert.equal(messageSent.name, 'view:setOptions');
  assert.deepEqual(messageSent.message.options, { components: true });
  await wait();
  checkbox = find('.js-filter-all-views input');
  checkbox.prop('checked', true);
  checkbox.trigger('change');
  await wait();
  assert.equal(messageSent.name, 'view:setOptions');
  assert.deepEqual(messageSent.message.options, { components: true });
  await wait();
});

test("Inspecting a model", async function(assert) {
  let messageSent = null;
  port.reopen({
    send(name, message) {
      messageSent = { name, message };
    }
  });

  await visit('/');
  let tree = defaultViewTree();
  run(() => {
    port.trigger('view:viewTree', { tree });
  });
  await wait();
  let model = find('.js-view-model-clickable').eq(0);
  await click(model);
  assert.equal(messageSent.name, 'objectInspector:inspectById');
  assert.equal(messageSent.message.objectId, 'postsArray');
});
