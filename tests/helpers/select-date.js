<<<<<<< HEAD
// Derived from https://raw.githubusercontent.com/edgycircle/ember-pikaday/master/addon/helpers/pikaday.js
import Ember from 'ember';
import moment from 'moment';

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
=======
// Derived from https://raw.githubusercontent.com/edgycircle/ember-pikaday/master/addon/helpers/pikaday.js
import { Promise as EmberPromise } from 'rsvp';

import { registerAsyncHelper } from '@ember/test';
import moment from 'moment';

function triggerNativeEvent(element, eventName) {
  if (document.createEvent) {
    let event = document.createEvent('Events');
    event.initEvent(eventName, true, false);
    element.dispatchEvent(event);
  } else {
    element.fireEvent(`on${eventName}`);
  }
}

registerAsyncHelper('selectDate', function(app, selector, date) {
  return new EmberPromise(function(resolve) {
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
