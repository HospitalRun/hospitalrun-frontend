import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('invoice', 'Unit | Model | invoice', {
  needs: [
    'model:patient',
    'model:visit',
    'model:price-profile',
    'model:payment',
    'model:billing-line-item',
    'model:line-item-detail',
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'service:session'
  ]
});

const lineItemsData = [
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
  Ember.run(() => {
    payments = [12.5, 10].map((amount) => {
      let model = this.store().createRecord('payment', { amount });
      model.set('currentState.parentState.isNew', false);
      return model;
    });
  });
  let invoice = this.subject();

  Ember.run(() => invoice.addPayment(payments[0]));
  assert.strictEqual(invoice.get('paidTotal'), 12.5, 'Should add first payment');

  Ember.run(() => invoice.addPayment(payments[1]));
  assert.strictEqual(invoice.get('paidTotal'), 22.5, 'Should add second payment');
});

test('billAsDate', function(assert) {
  let invoice = this.subject({
    billDate: new Date(1481745786401)
  });

  assert.strictEqual(invoice.get('billDateAsTime'), 1481745786401);
});

test('paidFlag', function(assert) {
  let invoice = this.subject({ status: 'Paid' });

  assert.strictEqual(invoice.get('paidFlag'), true);
});

test('paidFlag false', function(assert) {
  let invoice = this.subject();

  assert.strictEqual(invoice.get('paidFlag'), false);
});

test('discount', function(assert) {
  let lineItems, invoice;
  Ember.run(() => {
    lineItems = lineItemsData.map((item) => this.store().createRecord('billing-line-item', item));
    invoice = this.subject({ lineItems });
  });

  assert.strictEqual(invoice.get('discount'), 7);
});

test('nationalInsurance', function(assert) {
  let lineItems, invoice;
  Ember.run(() => {
    lineItems = lineItemsData.map((item) => this.store().createRecord('billing-line-item', item));
    invoice = this.subject({ lineItems });
  });

  assert.strictEqual(invoice.get('nationalInsurance'), 8);
});

test('privateInsurance', function(assert) {
  let lineItems, invoice;
  Ember.run(() => {
    lineItems = lineItemsData.map((item) => this.store().createRecord('billing-line-item', item));
    invoice = this.subject({ lineItems });
  });

  assert.strictEqual(invoice.get('privateInsurance'), 14);
});
