import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('language-select', 'Integration | Component | language select', {
  integration: true
  // beforeEach() {
  //   this.inject.service('i18n');
  // }
});

test('it renders', function(assert) {
  this.render(hbs`{{language-select}}`);

  assert.equal(this.$().text().trim().includes('Select Language'), true);
});
