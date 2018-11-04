import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sidebar-nav', 'Integration | Component | sidebar nav', {
  integration: true,
  beforeEach() {
    this.container.lookup('service:intl').setLocale('en');
  }
});

test('it renders about link when settings are shown', function(assert) {
  this.render(hbs`{{sidebar-nav}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`{{sidebar-nav isShowingSettings=true}}`);

  assert.ok(this.$().text().trim().includes('About HospitalRun'));
});

test('it does NOT render about link when settings are NOT shown', function(assert) {
  this.render(hbs`{{sidebar-nav}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`{{sidebar-nav}}`);

  assert.notOk(this.$().text().trim().includes('About HospitalRun'));
});
