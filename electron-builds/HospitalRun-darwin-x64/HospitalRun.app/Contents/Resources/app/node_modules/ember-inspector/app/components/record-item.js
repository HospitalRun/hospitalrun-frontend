import Ember from 'ember';
import RowEventsMixin from 'ember-inspector/mixins/row-events';
const { Component, computed, String: { htmlSafe }, isEmpty } = Ember;
const COLOR_MAP = {
  red: '#ff2717',
  blue: '#174fff',
  green: '#006400'
};

export default Component.extend(RowEventsMixin, {
  /**
   * No tag. This component should not affect
   * the DOM.
   *
   * @property tagName
   * @type {String}
   * @default ''
   */
  tagName: '',

  modelTypeColumns: null,

  /**
   * The index of the current row. Currently used for the
   * `RowEvents` mixin. This property is passed through
   * the template.
   *
   * @property index
   * @type {Number}
   * @default null
   */
  index: null,

  // TODO: Color record based on `color` property.
  style: computed('model.color', function() {
    let string = '';
    let colorName = this.get('model.color');
    if (!isEmpty(colorName)) {
      let color = COLOR_MAP[colorName];
      if (color) {
        string = `color: ${color};`;
      }
    }
    return htmlSafe(string);
  }),

  columns: computed('modelTypeColumns.[]', 'model.columnValues', function() {
    let columns = this.get('modelTypeColumns') || [];
    return columns.map(col => ({ name: col.name, value: this.get(`model.columnValues.${col.name}`) }));
  })
});
