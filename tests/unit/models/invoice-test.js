import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | invoice', function(hooks) {
  setupTest(hooks);

  let lineItemsData = [
    {
      category: 'test',
      privateInsurance: 10,
      nationalInsurance: 3,
      discount: 5
    },
    {
      privateInsurance: 4,
      nationalInsurance: 5,
      discount: 2
    }
  ];

  test('addPayment', function(assert) {
    let payments;
    run(() => {
      payments = [12.5, 10].map((amount) => {
        let model = this.owner.lookup('service:store').createRecord('payment', { amount });
        model.set('currentState.parentState.isNew', false);
        return model;
      });
    });
    let invoice = run(() => this.owner.lookup('service:store').createRecord('invoice'));

    run(() => invoice.addPayment(payments[0]));
    assert.strictEqual(invoice.get('paidTotal'), 12.5, 'Should add first payment');

    run(() => invoice.addPayment(payments[1]));
    assert.strictEqual(invoice.get('paidTotal'), 22.5, 'Should add second payment');
  });

  test('billAsDate', function(assert) {
    let invoice = run(() => this.owner.lookup('service:store').createRecord('invoice', {
      billDate: new Date(1481745786401)
    }));

    assert.strictEqual(invoice.get('billDateAsTime'), 1481745786401);
  });

  test('paidFlag', function(assert) {
    let invoice = run(() => this.owner.lookup('service:store').createRecord('invoice', { status: 'Paid' }));

    assert.strictEqual(invoice.get('paidFlag'), true);
  });

  test('paidFlag false', function(assert) {
    let invoice = run(() => this.owner.lookup('service:store').createRecord('invoice'));

    assert.strictEqual(invoice.get('paidFlag'), false);
  });

  test('discount', function(assert) {
    let lineItems, invoice;
    run(() => {
      lineItems = lineItemsData.map((item) => this.owner.lookup('service:store').createRecord('billing-line-item', item));
      invoice = run(() => this.owner.lookup('service:store').createRecord('invoice', { lineItems }));
    });

    assert.strictEqual(invoice.get('discount'), 7);
  });

  test('nationalInsurance', function(assert) {
    let lineItems, invoice;
    run(() => {
      lineItems = lineItemsData.map((item) => this.owner.lookup('service:store').createRecord('billing-line-item', item));
      invoice = run(() => this.owner.lookup('service:store').createRecord('invoice', { lineItems }));
    });

    assert.strictEqual(invoice.get('nationalInsurance'), 8);
  });

  test('privateInsurance', function(assert) {
    let lineItems, invoice;
    run(() => {
      lineItems = lineItemsData.map((item) => this.owner.lookup('service:store').createRecord('billing-line-item', item));
      invoice = run(() => this.owner.lookup('service:store').createRecord('invoice', { lineItems }));
    });

    assert.strictEqual(invoice.get('privateInsurance'), 14);
  });
});
