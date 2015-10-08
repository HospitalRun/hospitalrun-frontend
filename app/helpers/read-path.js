import Ember from 'ember';
export default Ember.Handlebars.makeBoundHelper(function (object, path) {
  if (Ember.isEmpty(path)) {
    return object;
  } else {
    return Ember.get(object, path);
  }
});
