<<<<<<< HEAD
import Ember from 'ember';
import moment from 'moment';
export default Ember.Helper.helper(function(params, hash) {
  if (!Ember.isEmpty(params[0])) {
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
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
