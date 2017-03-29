import Ember from 'ember';
const { Component, computed } = Ember;
const { bool, readOnly, and } = computed;

export default Component.extend({
  /**
   * No tag.
   *
   * @property tagName
   * @type {String}
   */
  tagName: '',

  known: bool('model.map.source'),

  url: computed('model.map.source', 'model.map.line', 'known', function() {
    let source = this.get('model.map.source');
    if (this.get('known')) {
      return `${source}:${this.get('model.map.line')}`;
    } else {
      return 'Unkown source';
    }
  }),

  adapter: readOnly('port.adapter'),

  isClickable: and('known', 'adapter.canOpenResource')
});
