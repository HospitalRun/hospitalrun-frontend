import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
import moment from 'moment';
export default helper(function(params, hash) {
  if (!isEmpty(params[0])) {
    let dateFormat = 'l';
    let [date] = params;
    if (hash && hash.format) {
      dateFormat = hash.format;
    }
    if (date && typeof date.get == 'function') {
      date = date.get('content');
    }
    return moment(date).format(dateFormat);
  }
});
