import Ember from 'ember';
export default Ember.Helper.helper(function([date, options]) {
  if (!Ember.isEmpty(date)) {
    var dateFormat = 'l';
    if (options && options.hash.format) {
      dateFormat = options.hash.format;
    }
    return moment(date).format(dateFormat);
  }
});
