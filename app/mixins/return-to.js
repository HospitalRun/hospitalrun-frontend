import Ember from 'ember';
export default Ember.Mixin.create({
  cancelAction: function() {
    var returnTo = this.get('model.returnTo');
    if (Ember.isEmpty(returnTo)) {
      return 'allItems';
    } else {
      return 'returnTo';
    }
  }.property('returnTo')
});
