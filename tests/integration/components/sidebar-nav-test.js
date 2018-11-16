import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sidebar nav', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    this.owner.lookup('service:intl').setLocale('en');
  });

  test('it renders about link when settings are shown', async function(assert) {
    await render(hbs`{{sidebar-nav isShowingSettings=true}}`);
    assert.dom('.settings-nav').includesText('About HospitalRun');
  });

  test('it does NOT render about link when settings are NOT shown', async function(assert) {
    await render(hbs`{{sidebar-nav}}`);
    assert.dom('.settings-nav').isNotVisible();
  });
});
