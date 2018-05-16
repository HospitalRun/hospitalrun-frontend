<<<<<<< HEAD
import Ember from 'ember';

export default Ember.Helper.helper(function([lhs, rhs]) {
  if (!Ember.isArray(lhs) || !Ember.isArray(rhs) || lhs.get('length') !== rhs.get('length')) {
    return false;
  }
  return lhs.every(function(item) {
    return rhs.includes(item);
  });
});
=======
import { isArray } from '@ember/array';
import { helper } from '@ember/component/helper';

export default helper(function([lhs, rhs]) {
  if (!isArray(lhs) || !isArray(rhs) || lhs.get('length') !== rhs.get('length')) {
    return false;
  }
  return lhs.every(function(item) {
    return rhs.includes(item);
  });
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
