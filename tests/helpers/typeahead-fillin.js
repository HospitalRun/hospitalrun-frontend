import Ember from 'ember';

Ember.Test.registerAsyncHelper('typeAheadFillIn', function(app, selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  fillIn(typeAheadSelector, value);
  triggerEvent(typeAheadSelector, 'input');
  triggerEvent(typeAheadSelector, 'blur');
  return app.testHelpers.wait();
});
