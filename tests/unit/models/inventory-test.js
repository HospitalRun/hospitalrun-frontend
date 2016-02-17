import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('inventory', 'Unit | Model | inventory', {
  // Specify the other units that are required for this test.
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'model:inv-location',
    'model:inv-purchase',
    'service:validations'
  ]
});

test('condition', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model, 'Model exists');

  Ember.run(() => {
    model.setProperties({
      estimatedDaysOfStock: 28,
      rank: 'A'
    });
  });
  assert.equal(model.get('condition'), 'good', 'Condition Should be good with given values');

  Ember.run(() => {
    model.set('estimatedDaysOfStock', 15);
  });
  assert.equal(model.get('condition'), 'average', 'Condition Should be average with new quantity');

  Ember.run(() => {
    model.set('rank', 'B');
  });
  assert.equal(model.get('condition'), 'good', 'Condition should be good again with new rank');

  Ember.run(() => {
    model.set('estimatedDaysOfStock', 6);
  });
  assert.equal(model.get('condition'), 'bad', 'Condition should be bad with new quantity');

  Ember.run(() => {
    model.set('rank', 'C');
  });
  assert.equal(model.get('condition'), 'average', 'Condition should be average again');
});
