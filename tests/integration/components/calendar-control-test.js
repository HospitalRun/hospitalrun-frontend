import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-control', 'Integration | Component | calendar control', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{calendar-control}}`);

  assert.equal(this.$('.ember-view.full-calendar').length, 1);
});
