import Ember from 'ember';
export default Ember.Helper.helper(function([lhs, rhs]) {
  return lhs === rhs;
});
