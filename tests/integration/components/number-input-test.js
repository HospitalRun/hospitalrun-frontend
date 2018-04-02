import EmberObject from '@ember/object';
import { isPresent } from '@ember/utils';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('number-input', 'Integration | Component | number input', {
  integration: true
});

test('the number-input renders', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#em-form model=model as |form|}}
      {{number-input model=model property='petType' label='Pet Type' class='test-number-input'}}
    {{/em-form}}
  `);

  assert.equal(this.$('label').text().trim(), 'Pet Type', 'it renders the label');
  assert.ok(isPresent(this.$('.test-number-input')), 'it renders the input field');
});

test('the number input sanitizes the data', function(assert) {
  assert.expect(1);

  this.set('model', EmberObject.create({ petType: 'cats' }));

  this.set('sanitizeFunction', (value) => {
    assert.equal(value, 'dragons', 'it passes the value to the sanitize function');
  });

  this.render(hbs`
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
  return wait();
});
