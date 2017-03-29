import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
let App;

let port;

module('Render Tree Tab', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
    port.reopen({
      send(/*n, m*/) {}
    });
  },
  afterEach() {
    Ember.run(App, App.destroy);
  }
});

function generateProfiles() {
  return [
    {
      name: 'First View Rendering',
      duration: 476.87,
      timestamp: (new Date(2014, 5, 1, 13, 16, 22, 715)).getTime(),
      children: [{
        name: 'Child view',
        duration: 0.36,
        timestamp: (new Date(2014, 5, 1, 13, 16, 22, 581)).getTime(),
        children: []
      }]
    },

    {
      name: "Second View Rendering",
      duration: 10,
      timestamp: (new Date(2014, 5, 1, 13, 16, 22, 759)).getTime(),
      children: []
    }
  ];
}


test("No profiles collected", async function(assert) {
  port.reopen({
    send(n/*, m*/) {
      if (n === 'render:watchProfiles') {
        this.trigger('render:profilesAdded', {
          profiles: []
        });
      }
    }
  });

  await visit('/render-tree');

  assert.equal(find('.js-render-tree').length, 0, "no render tree");
  assert.equal(find('.js-render-tree-empty').length, 1, "Message about empty render tree shown");
});

test("Renders the list correctly", async function(assert) {
  port.reopen({
    send(n/*, m*/) {
      if (n === 'render:watchProfiles') {
        this.trigger('render:profilesAdded', {
          profiles: generateProfiles()
        });
      }
    }
  });

  await visit('/render-tree');

  assert.equal(find('.js-render-tree').length, 1);
  let rows = find('.js-render-profile-item');
  assert.equal(rows.length, 2, "Two rows are rendered initially");

  assert.equal(find('.js-render-profile-name', rows[0]).text().trim(), "First View Rendering");
  assert.equal(find('.js-render-profile-duration', rows[0]).text().trim(), "476.87ms");
  assert.equal(find('.js-render-profile-timestamp', rows[0]).text().trim(), "13:16:22:715");

  assert.equal(find('.js-render-profile-name', rows[1]).text().trim(), "Second View Rendering");
  assert.equal(find('.js-render-profile-duration', rows[1]).text().trim(), "10.00ms");
  assert.equal(find('.js-render-profile-timestamp', rows[1]).text().trim(), "13:16:22:759");

  await click('.js-render-main-cell', rows[0]);

  rows = find('.js-render-profile-item');
  assert.equal(rows.length, 3, "Child is shown below the parent");

  assert.equal(find('.js-render-profile-name', rows[1]).text().trim(), "Child view");
  assert.equal(find('.js-render-profile-duration', rows[1]).text().trim(), "0.36ms");
  assert.equal(find('.js-render-profile-timestamp', rows[1]).text().trim(), "13:16:22:581");

  await click('.js-render-main-cell', rows[0]);

  rows = find('.js-render-profile-item');
  assert.equal(rows.length, 2, "Child is hidden when parent collapses");
});

test("Searching the profiles", async function(assert) {
  port.reopen({
    send(n/*, m*/) {
      if (n === 'render:watchProfiles') {
        this.trigger('render:profilesAdded', {
          profiles: generateProfiles()
        });
      }
    }
  });

  await visit('/render-tree');

  let rows = find('.js-render-profile-item');
  assert.equal(rows.length, 2, "Two rows are rendered initially");

  assert.equal(find('.js-render-profile-name', rows[0]).text().trim(), "First View Rendering");
  assert.equal(find('.js-render-profile-name', rows[1]).text().trim(), "Second View Rendering");

  await fillIn('input', find('.js-render-profiles-search'), 'first');

  rows = find('.js-render-profile-item');
  assert.equal(rows.length, 2, "The first parent is rendered with the child");
  assert.equal(find('.js-render-profile-name', rows[0]).text().trim(), "First View Rendering");
  assert.equal(find('.js-render-profile-name', rows[1]).text().trim(), "Child view");

  // Minimize to hide child view
  await click('.js-render-main-cell');

  await fillIn('input', find('.js-render-profiles-search'), '');

  rows = find('.js-render-profile-item');
  assert.equal(rows.length, 2, "filter is reset");

  assert.equal(find('.js-render-profile-name', rows[0]).text().trim(), "First View Rendering");
  assert.equal(find('.js-render-profile-name', rows[1]).text().trim(), "Second View Rendering");

  await fillIn('input', find('.js-render-profiles-search'), 'Second');

  rows = find('.js-render-profile-item');
  assert.equal(rows.length, 1, "The second row is the only one showing");
  assert.equal(find('.js-render-profile-name', rows[0]).text().trim(), "Second View Rendering");
});
