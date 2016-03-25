import Ember from 'ember';
export default Ember.Helper.helper(function([text]) {
  return new Ember.Handlebars.SafeString(text.replace(/\n/g, '<br>'));
});
