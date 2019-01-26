import EmberObject from '@ember/object';
import NumberFormat from 'hospitalrun/mixins/number-format';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | number-format', function(hooks) {
  setupTest(hooks);

  test('_calculateTotal', function(assert) {
    let records = [5, 5, 6].map((id) => EmberObject.create({ id }));
    let numberFormat = EmberObject.extend(NumberFormat).create({ records });

    assert.strictEqual(numberFormat._calculateTotal('records', 'id'), 16, 'Should add property array');
  });

  test('_calculateTotal property name', function(assert) {
    let records = [5, 2, 3].map((id) => EmberObject.create({ id }));
    let numberFormat = EmberObject.extend(NumberFormat).create();

    assert.strictEqual(numberFormat._calculateTotal(records, 'id'), 10, 'Should add passed in array');
  });

  test('_calculateTotal invalid number', function(assert) {
    let records = [5, 'test', 3].map((id) => EmberObject.create({ id }));
    let numberFormat = EmberObject.extend(NumberFormat).create({ records });

    assert.strictEqual(numberFormat._calculateTotal('records', 'id'), 8, 'Should treat invalid number as 0');
  });

  test('_numberFormat', function(assert) {
    let numberFormat = EmberObject.extend(NumberFormat).create();

    assert.strictEqual(numberFormat._numberFormat(), undefined, 'Should return undefined for no argument');
    assert.strictEqual(numberFormat._numberFormat('test'), undefined, 'Should return undefined for no number');
    assert.strictEqual(numberFormat._numberFormat(12), '12', 'Should return basic int as string');
    assert.strictEqual(numberFormat._numberFormat(12, true), 12, 'Should return basic int as number');
    assert.strictEqual(numberFormat._numberFormat(12.2, true), 12.2, 'Should round tenths properly');
    assert.strictEqual(numberFormat._numberFormat(12.2), '12.20', 'Should pad decial to two places');
    assert.strictEqual(numberFormat._numberFormat(35.555, true), 35.56, 'Should round 35.555 to 35.56');
    assert.strictEqual(numberFormat._numberFormat(35.555), '35.56', 'Should return 35.555 as string "35.56"');
  });

  test('_getValidNumber', function(assert) {
    let numberFormat = EmberObject.extend(NumberFormat).create();

    assert.strictEqual(numberFormat._getValidNumber(), 0, 'Should return 0 for no argument');
    assert.strictEqual(numberFormat._getValidNumber('test'), 0, 'Should return 0 for invalid number');
    assert.strictEqual(numberFormat._getValidNumber(NaN), 0, 'Should return 0 for NaN');
    assert.strictEqual(numberFormat._getValidNumber('12.2'), 12.2, 'Should convert string to number');
    assert.strictEqual(numberFormat._getValidNumber(1), 1, 'Should return basic int');
  });

  test('_validNumber', function(assert) {
    let numberFormat = EmberObject.extend(NumberFormat).create();

    assert.strictEqual(numberFormat._validNumber(1), true, 'Should return true for basic int');
    assert.strictEqual(numberFormat._validNumber(1.5), true, 'Should return true for float');
    assert.strictEqual(numberFormat._validNumber('1'), true, 'Should return true for numeric string');
    assert.strictEqual(numberFormat._validNumber(-1), false, 'Should return false for negative');
    assert.strictEqual(numberFormat._validNumber('test'), false, 'Should return false for non numeric string');
  });
});
