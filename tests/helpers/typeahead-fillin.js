import { fillIn, triggerEvent } from '@ember/test-helpers';
import $select from 'hospitalrun/tests/helpers/jquery-select';

async function typeAheadFillIn(selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  let typeAheadElement = $select(typeAheadSelector);
  await fillIn(typeAheadElement, value);
  await triggerEvent(typeAheadElement, 'input');
  await triggerEvent(typeAheadElement, 'blur');
}

export default typeAheadFillIn;
