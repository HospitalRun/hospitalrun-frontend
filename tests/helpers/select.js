import { run } from '@ember/runloop';
import $ from 'jquery';
import { registerAsyncHelper } from '@ember/test';

registerAsyncHelper('select', async function(app, selector, ...texts) {
  let $options = app.testHelpers.findWithAssert(`${selector} option`);

  $options.each(function() {
    let $option = $(this);

    run(() => {
      this.selected = texts.some((text) => $option.is(`:contains('${text}')`));
      if (this.selected) {
        $option.trigger('change');
      }
    });
  });

  await app.testHelpers.wait();
});
