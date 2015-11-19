import Ember from 'ember';

function waitToAppear(app, selector, interval = 200) {
  const isVisible = function() {
    return $(selector).length > 0;
  };
  return new Ember.RSVP.Promise(function(resolve) {
    const checkVisibility = function() {
      if (isVisible()) {
        resolve($(selector));
      } else {
        Ember.run.later(null, checkVisibility, interval);
      }
    };
    checkVisibility();
  });
}

Ember.Test.registerAsyncHelper('waitToAppear', waitToAppear);
