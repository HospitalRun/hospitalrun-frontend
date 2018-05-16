<<<<<<< HEAD
import Ember from 'ember';

Ember.Test.registerAsyncHelper('typeAheadFillIn', function(app, selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  fillIn(typeAheadSelector, value);
  triggerEvent(typeAheadSelector, 'input');
  triggerEvent(typeAheadSelector, 'blur');
  return app.testHelpers.wait();
});
=======
import { registerAsyncHelper } from '@ember/test';

registerAsyncHelper('typeAheadFillIn', function(app, selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  fillIn(typeAheadSelector, value);
  triggerEvent(typeAheadSelector, 'input');
  triggerEvent(typeAheadSelector, 'blur');
  return app.testHelpers.wait();
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
