async function typeAheadFillIn(selector, value) {
  let typeAheadSelector = `${selector} .tt-input`;
  await fillIn(typeAheadSelector, value);
  await triggerEvent(typeAheadSelector, 'input');
  await triggerEvent(typeAheadSelector, 'blur');
}

export default typeAheadFillIn;
