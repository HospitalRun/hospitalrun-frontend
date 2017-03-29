/**
 * Helper to build a style from its options. Also returns
 * a `SafeString` which avoids the style warning. Make sure
 * you don't pass user input to this helper.
 *
 * @method buildStyle
 * @param {Array} _ not used
 * @param {Object} options The options that become styles
 * @return {String} The style sting.
 */
import Ember from 'ember';
const { Helper: { helper }, String: { htmlSafe } } = Ember;
const { keys } = Object;

export function buildStyle(_, options) {
  return htmlSafe(keys(options).reduce((style, key) => `${style}${key}:${options[key]};`, ''));
}

export default helper(buildStyle);
