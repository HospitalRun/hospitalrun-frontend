import { run } from '@ember/runloop';
import { settled as wait } from '@ember/test-helpers';
import { findAll, findWithAssert } from 'ember-native-dom-helpers';

async function select(selector, ...texts) {
  findWithAssert(`${selector}`);
  let options = Array.from(findAll(`${selector} option`));

  options.forEach(function(option) {
    run(() => {
      if (texts.some((text) => option.textContent.includes(text))) {
        option.selected = true;
        option.parentNode.dispatchEvent(new Event('change'));
      }
    });
  });

  return wait();
}

export default select;
