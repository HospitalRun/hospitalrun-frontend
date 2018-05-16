<<<<<<< HEAD
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  classNames: ['clickable'],

  click() {
    this.sendAction('action', this.lab);
  }
});
=======
import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',
  classNames: ['clickable'],

  click() {
    this.sendAction('action', this.lab);
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
