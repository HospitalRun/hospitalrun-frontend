import checkCurrentRoute from 'ember-inspector/utils/check-current-route';
import { module, test } from 'qunit';

module("Unit | Helper | checkCurrentRoute");

test("matches the correct routes", function(assert) {
  assert.ok(checkCurrentRoute('whatever', 'application'), 'application is always current');
  assert.ok(checkCurrentRoute('index', 'index'), 'index route matches correctly');
  assert.ok(!checkCurrentRoute('posts.index', 'index'), 'resource match fails even when route name same as resource name');

  assert.ok(checkCurrentRoute('posts.show', 'posts'), 'resource matches correctly');
  assert.ok(!checkCurrentRoute('posts.show', 'comments'), 'resource matches correctly');
  assert.ok(checkCurrentRoute('posts.comments.show', 'posts'), 'parent resource of nested resources matches correctly');
  assert.ok(checkCurrentRoute('comments.show', 'comments.show'), 'exact resource and route matches correctly');
  assert.ok(checkCurrentRoute('posts.comments.show', 'comments.show'), 'child resource and route matches correctly');
});
