import Ember from 'ember';

export default Ember.Helper.helper(function([lhs, rhs]) {
  if (!Ember.isArray(lhs) || !Ember.isArray(rhs) || lhs.get('length') !== rhs.get('length')) {
    return false;
  }
  return lhs.every(function(item) {
    return rhs.includes(item);
  });
});
