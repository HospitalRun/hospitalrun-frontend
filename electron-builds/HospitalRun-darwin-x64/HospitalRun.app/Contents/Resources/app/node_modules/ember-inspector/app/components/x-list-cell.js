/**
 * An individual cell for the `x-list` table.
 * Usually not called directly but as a contextual helper.
 *
 * For example:
 *
 * ```javascript
 * {{#x-list as |list|}}
 *   <tr>
 *     {{#each model as |item|}}
 *       {{list.cell}} {{item.name}} {{/list.cell}}
 *     {{/each}}
 *   </tr>
 * {{/xlist}}
 * ```
 */
import Ember from 'ember';
const { Component, K, computed, String: { htmlSafe } } = Ember;
export default Component.extend({
  /**
   * Defaults to a table cell. For headers
   * set it to `th` by passing it through the
   * template.
   *
   * @property tagName
   * @type {String}
   * @default 'td'
   */
  tagName: 'td',

  /**
   * @property classNames
   * @type {Array}
   */
  classNames: ['list__cell'],

  /**
   * `highlight` and `clickable` or class modifiers.
   *
   * @property classNameBindings
   * @type {Array}
   */
  classNameBindings: ['highlight:list__cell_highlight', 'clickable:list__cell_clickable'],

  /**
   * Style passed through the `style` property
   * should end up as the DOM element's style.
   * Same applies to the `title` attribute.
   *
   * @property attributeBindings
   * @type {Array}
   */
  attributeBindings: ['safeStyle:style', 'title'],

  /**
   * Avoid unsafe style warning. This property does not
   * depend on user input so this is safe.
   *
   * @property safeStyle
   * @type {SafeString}
   */
  safeStyle: computed('style', function() {
    return htmlSafe(this.get('style'));
  }),

  /**
   * The `title` attribute of the DOM element.
   *
   * @property title
   * @type {String}
   * @default null
   */
  title: null,

  /**
   * The `style` attribute of the DOM element.
   *
   * @property style
   * @type {String}
   * @default null
   */
  style: null,

  /**
   * Cells can be clickable. One example would be clicking Data records to
   * inspect them in the object inspector. Set this property to `true` to
   * make this cell appear clickable (pointer cursor, underline...).
   *
   * @property clickable
   * @type {Boolean}
   * @default false
   */
  clickable: false,

  /**
   * Set this property to `true` to highlight the cell. For example
   * the current route in the Routes tab is highlighted.
   *
   * @property highlight
   * @type {Boolean}
   * @default false
   */
  highlight: false,

  /**
   * Action to trigger when the cell is clicked.
   * Pass the action through the template using the `action`
   * helper.
   *
   * @property on-click
   * @type {Function}
   */
  'on-click': K,

  /**
   * DOM event triggered when cell is clicked.
   * Calls the `on-click` action (if set).
   *
   * @method click
   */
  click() {
    this.get('on-click')();
  }
});
