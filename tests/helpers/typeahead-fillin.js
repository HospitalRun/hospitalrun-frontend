import { fillIn, triggerEvent } from '@ember/test-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import jqueryLength from 'hospitalrun/tests/helpers/deprecated-jquery-length';

async function typeAheadFillIn(selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  let typeAheadElement = jquerySelect(typeAheadSelector);
  await fillIn(typeAheadElement, value);
  await triggerEvent(typeAheadElement, 'input');
  await triggerEvent(typeAheadElement, 'blur');
}

export default typeAheadFillIn;
