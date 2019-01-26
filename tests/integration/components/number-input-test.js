import EmberObject from '@ember/object';
import { isPresent } from '@ember/utils';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | number input', function(hooks) {
  setupRenderingTest(hooks);

  test('the number-input renders', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#em-form model=model as |form|}}
        {{number-input model=model property='petType' label='Pet Type' class='test-number-input'}}
      {{/em-form}}
    `);

    assert.equal(this.$('label').text().trim(), 'Pet Type', 'it renders the label');
    assert.ok(isPresent(this.$('.test-number-input')), 'it renders the input field');
  });

  test('the number input sanitizes the data', async function(assert) {
    assert.expect(1);

    this.set('model', EmberObject.create({ petType: 'cats' }));

    this.set('sanitizeFunction', (value) => {
      assert.equal(value, 'dragons', 'it passes the value to the sanitize function');
    });

    await render(hbs`
      {{#em-form model=model as |form|}}
        {{number-input model=model
          property='petType'
          sanitizeFunction=sanitizeFunction
          label='Pet Type'
          class='test-number-input'}}
      {{/em-form}}
    `);

    this.$('input').eq(0).val('dragons');
    this.$('input').eq(0).trigger('input');
    this.$('input').eq(0).blur();
    return settled();
  });
});
