import Ember from 'ember';
export default Ember.Helper.helper(function([text]) {
  if (text !== null && typeof text !== 'undefined') {
    return Ember.String.htmlSafe(text.replace(/\n/g, '<br>'));
  } else {
    return null;
  }
});
