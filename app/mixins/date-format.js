import Ember from 'ember';
export default Ember.Mixin.create({
  _dateFormat: function(value, dateFormat) {
    if (Ember.isEmpty(dateFormat)) {
      dateFormat = 'l';
    }
    if (!Ember.isEmpty(value)) {
      return moment(value).format(dateFormat);
    }
  },

  dateToTime: function(date) {
    if (!Ember.isEmpty(date) && date.getTime) {
      return date.getTime();
    }
  }
});
