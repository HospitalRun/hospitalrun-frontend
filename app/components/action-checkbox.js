import Component from '@ember/component';
export default Component.extend({
  // From http://emberjs.jsbin.com/rwjblue/58/edit?html,css,js,output
  attributeBindings: ['type', 'value'],
  tagName: 'input',
  type: 'checkbox',
  checked: false,

  _updateElementValue: function() {
    this.set('checked', this.$().prop('checked'));
  }.on('didInsertElement'),

  change() {
    this._updateElementValue();
    this.sendAction('action', this.get('value'), this.get('checked'));
  }
});
