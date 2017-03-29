import Ember from "ember";
import escapeRegExp from "ember-inspector/utils/escape-reg-exp";
const { isEmpty } = Ember;

export default function(text, searchQuery) {
  if (isEmpty(searchQuery)) {
    return true;
  }
  let regExp = new RegExp(escapeRegExp(searchQuery.toLowerCase()));
  return !!text.toLowerCase().match(regExp);
}
