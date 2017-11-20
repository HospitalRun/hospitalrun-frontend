import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import moment from 'moment';
export default Mixin.create({
  _dateFormat(value, dateFormat) {
    if (isEmpty(dateFormat)) {
      dateFormat = 'l';
    }
    if (!isEmpty(value)) {
      return moment(value).format(dateFormat);
    }
  },

  dateToTime(date) {
    if (!isEmpty(date) && date.getTime) {
      return date.getTime();
    }
  }
});
