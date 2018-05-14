import { run } from '@ember/runloop';
import $ from 'jquery';

async function select(selector, ...texts) {
  let $options = findWithAssert(`${selector} option`);

  $options.each(function() {
    let $option = $(this);

    run(() => {
      this.selected = texts.some((text) => $option.is(`:contains('${text}')`));
      if (this.selected) {
        $option.trigger('change');
      }
    });
  });

  await wait();
}

export default select;
