import Ember from 'ember';

Ember.Test.registerAsyncHelper('select', function(app, selector, ...texts) {
  let $options = app.testHelpers.findWithAssert(`${selector} option`);

  $options.each(function() {
    let $option = Ember.$(this);

    Ember.run(() => {
      this.selected = texts.some((text) => $option.is(`:contains('${text}')`));
      if (this.selected) {
        $option.trigger('change');
      }
    });
  });

  return app.testHelpers.wait();
});
