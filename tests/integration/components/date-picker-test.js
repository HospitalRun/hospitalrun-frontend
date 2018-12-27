import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | date picker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it renders', async function(assert) {

    this.set('model', EmberObject.create({
      test: new Date()
    }));

    await render(hbs`{{date-picker model=model property="test"}}`);

    assert.equal(this.$().text().trim(), '');
  });

  test('it calls the event handler', async function(assert) {
    assert.expect(1);

    let stub = sinon.stub();

    this.actions.testAction = stub;
    this.set('model', EmberObject.create({
      test: new Date()
    }));

    await render(hbs`{{date-picker model=model property="test" dateSetAction="testAction"}}`);

    return settled().then(() => {
      sinon.assert.calledOnce(stub);
    });
  });
});
