import EmailValidation from 'hospitalrun/utils/email-validation';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utils | email-validation', function(hooks) {
  setupTest(hooks);

  test('emailRegex', function(assert) {
    assert.notStrictEqual('test@example.com'.match(EmailValidation.emailRegex), null, 'Should be valid with standard email');
    assert.notStrictEqual('test.person@example.com'.match(EmailValidation.emailRegex), null, 'Should be valid with dot');
    assert.notStrictEqual('test+person@example.com'.match(EmailValidation.emailRegex), null, 'Should be valid with plus');
    assert.notStrictEqual('test@example.randomnewtld'.match(EmailValidation.emailRegex), null, 'Should be valid with tld');

    assert.strictEqual('test@@example.com'.match(EmailValidation.emailRegex), null, 'Should be invalid with two @');
    assert.strictEqual('<Test Person> test.person@example.com'.match(EmailValidation.emailRegex), null, 'Should be invalid with name');
  });
});
