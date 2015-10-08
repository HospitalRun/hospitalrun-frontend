import Ember from 'ember';
export default Ember.Mixin.create({
  isUpdateDisabled: function () {
    if (!Ember.isNone(this.get('isValid'))) {
      return !this.get('isValid');
    } else {
      return false;
    }
  }.property('isValid')
});
