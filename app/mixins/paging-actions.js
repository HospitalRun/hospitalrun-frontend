<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Mixin.create({
  firstPage: 'firstPage',
  lastPage: 'lastPage',
  nextPage: 'nextPage',
  previousPage: 'previousPage',
  actions: {
    firstPage() {
      this.sendAction('firstPage');
    },
    lastPage() {
      this.sendAction('lastPage');
    },
    nextPage() {
      this.sendAction('nextPage');
    },
    previousPage() {
      this.sendAction('previousPage');
    }
  }
});
=======
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  firstPage: 'firstPage',
  lastPage: 'lastPage',
  nextPage: 'nextPage',
  previousPage: 'previousPage',
  actions: {
    firstPage() {
      this.sendAction('firstPage');
    },
    lastPage() {
      this.sendAction('lastPage');
    },
    nextPage() {
      this.sendAction('nextPage');
    },
    previousPage() {
      this.sendAction('previousPage');
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
