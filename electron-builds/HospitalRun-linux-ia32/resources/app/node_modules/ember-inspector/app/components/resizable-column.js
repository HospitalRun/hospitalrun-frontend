import Ember from "ember";
const { Component, computed, String: { htmlSafe } } = Ember;
export default Component.extend({
  width: null,

  attributeBindings: ['style'],

  style: computed('width', function () {
    return htmlSafe(`-webkit-flex: none; flex: none; width: ${this.get('width')}px;`);
  }),

  didInsertElement() {
    if (!this.get('width')) {
      this.set('width', this.$().width());
    }
  }
});
