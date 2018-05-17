// Derived from https://raw.githubusercontent.com/edgycircle/ember-pikaday/master/addon/helpers/pikaday.js
import moment from 'moment';

import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';

function triggerNativeEvent(element, eventName) {
  if (document.createEvent) {
    let event = document.createEvent('Events');
    event.initEvent(eventName, true, false);
    element.dispatchEvent(event);
  } else {
    element.fireEvent(`on${eventName}`);
  }
}

async function selectDate(selector, date) {
  await click(selector);
  await waitToAppear('.pika-single:not(.is-hidden)');
  await fillIn(selector, moment(date).format('l'));
  triggerNativeEvent($(selector)[0], 'change');
}

export default selectDate;
