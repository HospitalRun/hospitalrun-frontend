import Ember from 'ember';

function isVisible(selector) {
  return $(selector).length > 0;
}

function checkVisibility(selector, interval, resolve, visibility) {
  if (isVisible(selector) === visibility) {
    resolve($(selector));
  } else {
    Ember.run.later(null, function() {
      checkVisibility(selector, interval, resolve, visibility);
    }, interval);
  }
}

function waitToAppear(app, selector, interval = 200) {
  return new Ember.RSVP.Promise(function(resolve) {
    checkVisibility(selector, interval, resolve, true);
  });
}

function waitToDisappear(app, selector, interval = 200) {
  return new Ember.RSVP.Promise(function(resolve) {
    checkVisibility(selector, interval, resolve, false);
  });
}
Ember.Test.registerAsyncHelper('waitToAppear', waitToAppear);
Ember.Test.registerAsyncHelper('waitToDisappear', waitToDisappear);
