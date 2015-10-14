import Ember from 'ember';
export default Ember.Helper.helper(function([object, path]) {
  if (Ember.isEmpty(path)) {
    return object;
  } else {
    return Ember.get(object, path);
  }
});
