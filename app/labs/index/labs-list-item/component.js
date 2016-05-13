import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  classNames: ['clickable'],

  click() {
    this.sendAction('action', this.lab);
  }
});
