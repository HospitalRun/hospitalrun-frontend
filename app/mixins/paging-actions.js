import Ember from 'ember';
export default Ember.Mixin.create({
  firstPage: 'firstPage',
  lastPage: 'lastPage',
  nextPage: 'nextPage',
  previousPage: 'previousPage',
  actions: {
    firstPage: function() {
      this.sendAction('firstPage');
    },
    lastPage: function() {
      this.sendAction('lastPage');
    },
    nextPage: function() {
      this.sendAction('nextPage');
    },
    previousPage: function() {
      this.sendAction('previousPage');
    }
  }
});
