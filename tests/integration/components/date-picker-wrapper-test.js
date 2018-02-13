import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('date-picker-wrapper', 'Integration | Component | date picker wrapper', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('test', 'test');
  this.render(hbs`{{date-picker-wrapper model=this property=test}}`);

  assert.equal(this.$().text().trim(), '');
});
