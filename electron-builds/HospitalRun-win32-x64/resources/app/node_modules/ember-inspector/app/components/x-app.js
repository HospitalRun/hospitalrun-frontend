import Ember from 'ember';
const { Component, computed: { not } } = Ember;
export default Component.extend({
  classNames: ['app'],

  classNameBindings: [
    'inactive',
    'isDragging'
  ],

  attributeBindings: ['tabindex'],
  tabindex: 1,

  isDragging: false,

  /**
   * Bound to application controller.
   *
   * @property active
   * @type {Boolean}
   * @default false
   */
  active: false,

  inactive: not('active'),

  focusIn() {
    if (!this.get('active')) {
      this.set('active', true);
    }
  },

  focusOut() {
    if (this.get('active')) {
      this.set('active', false);
    }
  }
});
