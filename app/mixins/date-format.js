<<<<<<< HEAD
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
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
