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
