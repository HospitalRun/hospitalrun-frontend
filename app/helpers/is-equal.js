<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Helper.helper(function([lhs, rhs]) {
  return lhs === rhs;
});
=======
import { helper } from '@ember/component/helper';
export default helper(function([lhs, rhs]) {
  return lhs === rhs;
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
