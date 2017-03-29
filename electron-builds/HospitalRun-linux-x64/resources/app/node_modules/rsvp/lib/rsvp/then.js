import { config } from './config';
import instrument from './instrument';
import {
  noop,
  subscribe,
  FULFILLED,
  REJECTED,
  invokeCallback
} from './-internal';

export default function then(onFulfillment, onRejection, label) {
  let parent = this;
  let state = parent._state;

  if (state === FULFILLED && !onFulfillment || state === REJECTED && !onRejection) {
    config.instrument && instrument('chained', parent, parent);
    return parent;
  }

  parent._onError = null;

  let child = new parent.constructor(noop, label);
  let result = parent._result;

  config.instrument && instrument('chained', parent, child);

  if (state) {
    let callback = arguments[state - 1];
    config.async(() => invokeCallback(state, child, callback, result));
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}
