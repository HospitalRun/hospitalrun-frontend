import { Promise as EmberPromise } from 'rsvp';
import { later } from '@ember/runloop';

function isVisible(selector) {
  return $(selector).length > 0;
}

function checkVisibility(selector, interval, resolve, visibility) {
  if (isVisible(selector) === visibility) {
    resolve($(selector));
  } else {
    later(null, function() {
      checkVisibility(selector, interval, resolve, visibility);
    }, interval);
  }
}

export async function waitToAppear(selector, interval = 200) {
  await new EmberPromise(function(resolve) {
    checkVisibility(selector, interval, resolve, true);
  });
}

export async function waitToDisappear(selector, interval = 200) {
  await new EmberPromise(function(resolve) {
    checkVisibility(selector, interval, resolve, false);
  });
}
