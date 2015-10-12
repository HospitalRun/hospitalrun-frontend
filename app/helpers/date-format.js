import Ember from 'ember';
export default Ember.Handlebars.makeBoundHelper(function(date, options) {
  if (!Ember.isEmpty(date)) {
    var dateFormat = 'l';
    if (options && options.hash.format) {
      dateFormat = options.hash.format;
    }
    return moment(date).format(dateFormat);
  }
});
