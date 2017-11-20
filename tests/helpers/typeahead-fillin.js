import { registerAsyncHelper } from '@ember/test';

registerAsyncHelper('typeAheadFillIn', function(app, selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  fillIn(typeAheadSelector, value);
  triggerEvent(typeAheadSelector, 'input');
  triggerEvent(typeAheadSelector, 'blur');
  return app.testHelpers.wait();
});
