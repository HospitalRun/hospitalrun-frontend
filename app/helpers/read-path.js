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
