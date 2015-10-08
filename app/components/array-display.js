import Ember from 'ember';
export default Ember.Component.extend({
  isArray: function () {
    var content = this.get('content');
    return Ember.isArray(content);
  }.property('content')
});
