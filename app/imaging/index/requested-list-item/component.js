import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',
  classNames: ['clickable'],

  click() {
    this.sendAction('action', this.imaging);
  }
});
