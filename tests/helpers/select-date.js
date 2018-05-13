// Derived from https://raw.githubusercontent.com/edgycircle/ember-pikaday/master/addon/helpers/pikaday.js
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

registerAsyncHelper('selectDate', async function(app, selector, date) {
  await click(selector);
  await waitToAppear('.pika-single:not(.is-hidden)');
  await fillIn(selector, moment(date).format('l'));
  triggerNativeEvent(app.$(selector)[0], 'change');
});
