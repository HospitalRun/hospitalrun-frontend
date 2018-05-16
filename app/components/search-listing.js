<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Component.extend({
  action: 'allItems',
  actions: {
    allItems() {
      this.sendAction();
    }
  }
});
=======
import Component from '@ember/component';
export default Component.extend({
  action: 'allItems',
  actions: {
    allItems() {
      this.sendAction();
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
