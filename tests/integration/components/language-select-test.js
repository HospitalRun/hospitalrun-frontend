import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const languagePreference = {
  saveUserLanguagePreference: sinon.stub()
};

moduleForComponent('language-select', 'Integration | Component | language select', {
  integration: true,
  beforeEach() {
    this.inject.service('intl');
    this.register('service:language-preference', Service.extend(languagePreference));
    this.inject.service('language-preference', { as: 'languagePreference' });
    this.container.owner.lookup('service:intl').setLocale('en');
  },
  afterEach() {
    languagePreference.saveUserLanguagePreference.reset();
  }
});

test('it renders', function(assert) {
  assert.expect(4);

  this.render(hbs`{{language-select}}`);

  assert.ok(this.$('.language-select').length);
  assert.equal(this.$('option[value=""]', '.language-select').text().trim(), 'Select Language');
  assert.equal(this.$('option[value="de"]', '.language-select').text().trim(), 'Deutsch');
  assert.ok(this.$('option', '.language-select').length > 2, 'There are not so many languages');
});

test('it reacts to language updates', function(assert) {
  assert.expect(1);

  this.render(hbs`{{language-select}}`);
  this.$('.language-select').val('de').change();

  sinon.assert.calledWith(languagePreference.saveUserLanguagePreference, 'de');
});

test('it calls finish event', function(assert) {
  assert.expect(1);

  let finish = sinon.stub();
  this.set('externalFinish', finish);

  this.render(hbs`{{language-select onFinish=(action externalFinish)}}`);
  this.$('.language-select').val('de').change();

  sinon.assert.calledOnce(finish);
});
