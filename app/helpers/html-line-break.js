import Ember from 'ember';
export default Ember.Helper.helper(function([text]) {
  if (text !== null && typeof text !== 'undefined') {
    return new Ember.Handlebars.SafeString(text.replace(/\n/g, '<br>'));
  } else {
    return null;
  }
});