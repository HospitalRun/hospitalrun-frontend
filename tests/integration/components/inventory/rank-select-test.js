import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inventory/rank-select', 'Integration | Component | inventory/rank select', {
  integration: true
});

test('it renders correctly', function(assert) {
  this.set('value', null);

  this.render(hbs`{{inventory/rank-select
    property='value'
    prompt='n/a'
  }}`);

  // options
  let $options = this.$('option');
  assert.equal($options.length, 4, 'Should render 4 options');
  assert.equal($options[0].value, '', 'First option value is empty (prompt)');
  assert.equal($options[0].innerHTML.trim(), 'n/a', 'First option label is prompt');
  assert.equal($options[1].value, 'A', 'Second option is "A"');
  assert.equal($options[2].value, $options[2].innerHTML.trim(), 'Values are similar as labels');
});
