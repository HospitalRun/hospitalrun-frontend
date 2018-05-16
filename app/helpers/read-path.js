<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Helper.helper(function([object, path]) {
  if (Ember.isEmpty(path)) {
    return object;
  } else {
    return Ember.get(object, path);
  }
});
=======
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
export default helper(function([object, path]) {
  if (isEmpty(path)) {
    return object;
  } else {
    return get(object, path);
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
