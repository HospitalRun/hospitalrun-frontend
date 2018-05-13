import { registerAsyncHelper } from '@ember/test';

registerAsyncHelper('typeAheadFillIn', async function(app, selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  await fillIn(typeAheadSelector, value);
  await triggerEvent(typeAheadSelector, 'input');
  await triggerEvent(typeAheadSelector, 'blur');
});
