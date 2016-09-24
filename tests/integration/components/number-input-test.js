import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('number-input', 'Integration | Component | number input', {
  integration: true
});

test('the number-input renders', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#em-form model=model}}
      {{number-input property='petType' label='Pet Type' class='test-number-input'}}
    {{/em-form}}
  `);

  assert.equal(this.$('label').text().trim(), 'Pet Type', 'it renders the label');
  assert.ok(Ember.isPresent(this.$('.test-number-input')), 'it renders the input field');
});

test('the number input sanitizes the data', function(assert) {
  assert.expect(1);

  this.set('model', Ember.Object.create({ petType: 'cats' }));

  this.set('sanitizeFunction', (value) => {
    assert.equal(value, 'dragons', 'it passes the value to the sanitize function');
  });

  this.render(hbs`
    {{#em-form model=model}}
      {{number-input
        property='petType'
        sanitizeFunction=sanitizeFunction
        label='Pet Type'
        class='test-number-input'}}
    {{/em-form}}
  `);

  this.$('input').eq(0).val('dragons');
  this.$('input').trigger('input');
  this.$('input').trigger('change');
});
