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
