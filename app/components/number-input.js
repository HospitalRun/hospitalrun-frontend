import Ember from 'ember';

export default Ember.Component.extend({
  sanitizeFunction(value) {
    return value.replace(new RegExp(/([^0-9|.]+)/g), '');
  },
  tagName: '',
  actions: {
    sanitize(value) {
      return this.get('sanitizeFunction')(value);
    }
  }
});
