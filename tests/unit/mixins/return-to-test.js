import { run } from '@ember/runloop';
import ReturnTo from 'hospitalrun/mixins/return-to';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DS from 'ember-data';

module('Unit | Mixin | return-to', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.subject = function(attrs) {
      return run(() => {
        let Test = DS.Model.extend(ReturnTo);
        this.owner.register('model:test', Test);
        return this.store().createRecord('test', attrs);
      });
    };

    this.store = function() {
      return this.owner.lookup('service:store');
    };
  });

  test('cancelAction', function(assert) {
    let returnTo = this.subject({
      model: {
        returnTo: 'test'
      }
    });

    assert.strictEqual(returnTo.get('cancelAction'), 'returnTo');
  });

  test('cancelAction allItems', function(assert) {
    let returnTo = this.subject();

    assert.strictEqual(returnTo.get('cancelAction'), 'allItems');
  });
});
