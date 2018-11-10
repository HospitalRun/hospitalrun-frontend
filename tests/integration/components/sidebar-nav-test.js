import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sidebar nav', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders about link when settings are shown', async function(assert) {
    await render(hbs`{{sidebar-nav}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    await render(hbs`
      {{sidebar-nav isShowingSettings=true}}
    `);

    assert.ok(this.$().text().trim().includes('About HospitalRun'));
  });

  test('it does NOT render about link when settings are NOT shown', async function(assert) {
    await render(hbs`{{sidebar-nav}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    await render(hbs`
      {{sidebar-nav}}
    `);

    assert.notOk(this.$().text().trim().includes('About HospitalRun'));
  });
});
