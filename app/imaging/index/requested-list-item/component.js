<<<<<<< HEAD
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  classNames: ['clickable'],

  click() {
    this.sendAction('action', this.imaging);
  }
});
=======
import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',
  classNames: ['clickable'],

  click() {
    this.sendAction('action', this.imaging);
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
