import Ember from 'ember';
import moment from 'moment';
export default Ember.Mixin.create({
  _dateFormat(value, dateFormat) {
    if (Ember.isEmpty(dateFormat)) {
      dateFormat = 'l';
    }
    if (!Ember.isEmpty(value)) {
      return moment(value).format(dateFormat);
    }
  },

  dateToTime(date) {
    if (!Ember.isEmpty(date) && date.getTime) {
      return date.getTime();
    }
  }
});
