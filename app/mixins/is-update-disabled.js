import Ember from 'ember';
export default Ember.Mixin.create({
  isUpdateDisabled: function() {
    if (!Ember.isNone(this.get('model.isValid'))) {
      return !this.get('model.isValid');
    } else {
      return false;
    }
  }.property('model.isValid')
});
