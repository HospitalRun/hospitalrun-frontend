import Ember from 'ember';
export default Ember.Component.extend({
  action: 'allItems',
  actions: {
    allItems: function() {
      this.sendAction();
    }
  }
});
