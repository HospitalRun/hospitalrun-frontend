/**
 * One way helper when we want to avoid two-way bound attributes.
 * This would probably not be needed once one-way becomes the default.
 *
 * @method oneWay
 * @param {Array} [val] The array containing one value.
 * @return {Any} The value passed
 */
import Ember from 'ember';
const { Helper: { helper } } = Ember;

export function oneWay([val]) {
  return val;
}

export default helper(oneWay);
