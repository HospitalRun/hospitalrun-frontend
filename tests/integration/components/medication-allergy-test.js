import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('medication-allergy', 'Integration | Component | medication allergy', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{medication-allergy}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#medication-allergy}}
      template block text
    {{/medication-allergy}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
