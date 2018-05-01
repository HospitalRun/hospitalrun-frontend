import { run } from '@ember/runloop';
import ReturnTo from 'hospitalrun/mixins/return-to';
import { moduleFor, test } from 'ember-qunit';
import DS from 'ember-data';

moduleFor('mixin:return-to', 'Unit | Mixin | return-to', {
  subject(attrs) {
    return run(() => {
      let Test = DS.Model.extend(ReturnTo);
      this.register('model:test', Test);
      return this.store().createRecord('test', attrs);
    });
  },
  store() {
    return this.container.lookup('service:store');
  }
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
