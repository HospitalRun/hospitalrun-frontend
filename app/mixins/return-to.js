import Ember from 'ember';
export default Ember.Mixin.create({
  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (Ember.isEmpty(returnTo)) {
      return 'allItems';
    } else {
      return 'returnTo';
    }
  }.property('returnTo')
});
