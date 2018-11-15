// Derived from https://raw.githubusercontent.com/edgycircle/ember-pikaday/master/addon/helpers/pikaday.js
import moment from 'moment';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import { click, fillIn } from '@ember/test-helpers';
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
  await click(jquerySelect(selector));
  await waitToAppear('.pika-single:not(.is-hidden)');
  await fillIn(jquerySelect(selector), moment(date).format('l'));
  triggerNativeEvent(jquerySelect(selector), 'change');
}

export default selectDate;
