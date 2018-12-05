import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { run } from '@ember/runloop';

const languagePreference = {
  saveUserLanguagePreference: sinon.stub()
};

module('Integration | Component | language select', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:language-preference', Service.extend(languagePreference));
    this.languagePreference = this.owner.lookup('service:language-preference');
    this.owner.lookup('service:intl').setLocale('en');
  });

  hooks.afterEach(function() {
    languagePreference.saveUserLanguagePreference.reset();
  });

  test('it renders', async function(assert) {
    assert.expect(4);

    await render(hbs`{{language-select}}`);

    assert.ok(this.$('.language-select').length);
    assert.equal(this.$('option[value=""]', '.language-select').text().trim(), 'Select Language');
    assert.equal(this.$('option[value="de"]', '.language-select').text().trim(), 'Deutsch');
    assert.ok(this.$('option', '.language-select').length > 2, 'There are not so many languages');
  });

  test('it reacts to language updates', async function(assert) {
    assert.expect(1);

    await render(hbs`{{language-select}}`);
    this.$('.language-select').val('de').change();

    sinon.assert.calledWith(languagePreference.saveUserLanguagePreference, 'de');
  });

  test('it calls finish event', async function(assert) {
    assert.expect(1);

    let finish = sinon.stub();
    this.set('externalFinish', finish);

    await render(hbs`{{language-select onFinish=(action externalFinish)}}`);
    this.$('.language-select').val('de').change();

    sinon.assert.calledOnce(finish);
  });
});

test('it selects current locale from service in the dropdown by default', async function(assert) {
  await this.render(hbs`{{language-select}}`);
  let getSelectedOption = () => {
    let options = this.$('.language-select option').toArray();
    return options.filter((option) => option.selected === true).pop();
  };

  run(() => this.container.owner.lookup('service:intl').setLocale('de'));
  let selectedOption = getSelectedOption();
  assert.equal(selectedOption.innerText, 'Deutsch', 'it selects the currently selected locale');

  run(() => this.container.owner.lookup('service:intl').setLocale('fr'));
  selectedOption = getSelectedOption();
  assert.equal(selectedOption.innerText, 'Français', 'it selects the locale changed in service');
});
