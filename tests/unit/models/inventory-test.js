import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | inventory', function(hooks) {
  setupTest(hooks);

  test('condition', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('inventory'));
    // let store = this.store();
    assert.ok(!!model, 'Model exists');

    run(() => {
      model.setProperties({
        estimatedDaysOfStock: 28,
        rank: 'A'
      });
    });
    assert.equal(model.get('condition'), 'good', 'Condition Should be good with given values');

    run(() => {
      model.set('estimatedDaysOfStock', 15);
    });
    assert.equal(model.get('condition'), 'average', 'Condition Should be average with new quantity');

    run(() => {
      model.set('rank', 'B');
    });
    assert.equal(model.get('condition'), 'good', 'Condition should be good again with new rank');

    run(() => {
      model.set('estimatedDaysOfStock', 6);
    });
    assert.equal(model.get('condition'), 'bad', 'Condition should be bad with new quantity');

    run(() => {
      model.set('rank', 'C');
    });
    assert.equal(model.get('condition'), 'average', 'Condition should be average again');
  });
});
