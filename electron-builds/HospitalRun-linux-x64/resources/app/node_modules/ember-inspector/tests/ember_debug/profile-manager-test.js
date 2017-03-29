/* globals require */
import { test } from 'qunit';
const ProfileManager = require('ember-debug/models/profile-manager').default;

test("Construction", function(assert) {
  let manager = new ProfileManager();
  assert.ok(!!manager, "it was created");
  assert.equal(manager.profiles.length, 0, "it has no profiles");
});
