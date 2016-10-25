// Derived from https://raw.githubusercontent.com/edgycircle/ember-pikaday/master/addon/helpers/pikaday.js
import Ember from 'ember';

function triggerNativeEvent(element, eventName) {
  if (document.createEvent) {
    let event = document.createEvent('Events');
    event.initEvent(eventName, true, false);
    element.dispatchEvent(event);
  } else {
    element.fireEvent(`on${eventName}`);
  }
}

Ember.Test.registerAsyncHelper('selectDate', function(app, selector, date) {
  return new Ember.RSVP.Promise(function(resolve) {
    click(selector);
    waitToAppear('.pika-single:not(.is-hidden)').then(function() {
      fillIn(selector, moment(date).format('l'));
      andThen(function() {
        triggerNativeEvent(app.$(selector)[0], 'change');
        resolve();
      });
    });
  });
});
