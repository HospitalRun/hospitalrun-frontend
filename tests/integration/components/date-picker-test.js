import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import wait from 'ember-test-helpers/wait';

moduleForComponent('date-picker', 'Integration | Component | date picker', {
  integration: true
});

test('it renders', function(assert) {

  this.set('model', EmberObject.create({
    test: new Date()
  }));

  this.render(hbs`{{date-picker model=model property="test"}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it calls the event handler', function(assert) {
  assert.expect(1);

  let stub = sinon.stub();

  this.on('testAction', stub);
  this.set('model', EmberObject.create({
    test: new Date()
  }));

  this.render(hbs`{{date-picker model=model property="test" dateSetAction="testAction"}}`);

  return wait().then(() => {
    sinon.assert.calledOnce(stub);
  });
});
