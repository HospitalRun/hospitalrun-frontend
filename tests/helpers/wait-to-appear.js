import { waitUntil } from '@ember/test-helpers';

function isVisible(selector) {
  return $(selector).length > 0;
}

export async function waitToAppear(selector) {
  await waitUntil(() => isVisible(selector));
}

export async function waitToDisappear(selector) {
  await waitUntil(() => !isVisible(selector));
}
