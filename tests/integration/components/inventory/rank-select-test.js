import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inventory/rank select', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders correctly', async function(assert) {
    this.set('value', null);

    await render(hbs`{{#em-form model=model submitButton=false as |form|}}
    {{inventory/rank-select form=form
      property='value'
      prompt='n/a'
    }}
    {{/em-form}}`);

    // options
    let $options = this.$('option');
    assert.equal($options.length, 4, 'Should render 4 options');
    assert.equal($options[0].value, '', 'First option value is empty (prompt)');
    assert.equal($options[0].innerHTML.trim(), 'n/a', 'First option label is prompt');
    assert.equal($options[1].value, 'A', 'Second option is "A"');
    assert.equal($options[2].value, $options[2].innerHTML.trim(), 'Values are similar as labels');
  });
});
