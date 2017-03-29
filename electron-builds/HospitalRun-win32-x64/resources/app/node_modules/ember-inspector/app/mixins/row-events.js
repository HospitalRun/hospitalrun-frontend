/**
 * Mixin to work-around the fact that we can't listen to row events
 * when using smoke-and-mirrors and tables.
 *
 * Add this to a tagless component inside a vertical-collection row and pass
 * the yielded `x-list` and index to it. Then you'll be able to listen
 * to events on `rowEvents`.
 */
import Ember from 'ember';
const { Mixin, assert, isNone, computed: { readOnly }, K } = Ember;

export default Mixin.create({
  /**
   * The current component's index. Pass this through the
   * template so the mixin can figure out which row this component
   * belongs to.
   *
   * @property index
   * @default null
   */
  index: null,

  /**
   * Action to trigger when a row is clicked.
   *
   * @property on-click
   * @type {Function}
   * @default Ember.K
   */
  'on-click': K,

  /**
   * Action to trigger when a row mouseenter event is triggered.
   *
   * @property on-mouseenter
   * @type {Function}
   * @default Ember.K
   */
  'on-mouseenter': K,

  /**
   * Action to trigger when a row mouseleave event is triggered.
   *
   * @property on-mouseleave
   * @type {Function}
   * @default Ember.K
   */
  'on-mouseleave': K,

  /**
   * An alias to the list's `rowEvents` property.
   * The component must have a `list` property containing
   * the yielded `x-list`.
   *
   * @property rowEvents
   * @type {Ember.Object}
   */
  rowEvents: readOnly('list.rowEvents'),


  /**
   * Hook called on element insert. Sets up event listeners.
   *
   * @method didInsertElement
   */
  didInsertElement() {
    assert('You must pass `list` to a component that listens to row-events', !!this.get('list'));
    assert('You must pass `index` to a component that listens to row-events', !isNone(this.get('index')));

    this.get('rowEvents').on('click', this, 'handleEvent');
    this.get('rowEvents').on('mouseleave', this, 'handleEvent');
    this.get('rowEvents').on('mouseenter', this, 'handleEvent');
    return this._super(...arguments);
  },

  /**
   * Hook called before destroying the element.
   * Cleans up event listeners.
   *
   * @method willDestroyElement
   */
  willDestroyElement() {
    this.get('rowEvents').off('click', this, 'handleEvent');
    this.get('rowEvents').off('mouseleave', this, 'handleEvent');
    this.get('rowEvents').off('mouseenter', this, 'handleEvent');
    return this._super(...arguments);
  },

  /**
   * Makes sure the event triggered matches the current
   * component's index.
   *
   * @method handleEvent
   * @param {Object}
   *  - {Number} index The current row index
   *  - {String} type Event type
   */
  handleEvent({ index, type }) {
    if (index === this.get('index')) {
      if (this.get(`on-${type}`)) {
        this.get(`on-${type}`)();
      }
    }
  }
});
