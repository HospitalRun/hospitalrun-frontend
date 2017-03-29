import Ember from 'ember';

const { Component, computed, String: { htmlSafe }, Evented, $, run, Object: EmberObject, inject } = Ember;
const { schedule } = run;
const { service } = inject;

/**
 * Base list view config
 *
 * @module Components
 * @extends Component
 * @class List
 * @namespace Components
 */
export default Component.extend(Evented, {
  /**
   * The layout service. Used to observe the app's content height.
   *
   * @property layoutService
   * @type {Service}
   */
  layoutService: service('layout'),

  /**
   * @property classNames
   * @type {Array}
   */
  classNames: ["list__content", "js-list-content"],

  /**
   * Hook called when content element is inserted.
   * Used to setup event listeners to work-around
   * smoke-and-mirrors lack of events.
   *
   * @method didInsertElement
   */
  didInsertElement() {
    schedule('afterRender', this, this.setupHeight);
    schedule('afterRender', this, this.setupEvents);
  },

  /**
   * Set up the content height and listen to any updates to that property.
   *
   * @method setupHeight
   */
  setupHeight() {
    this.set('contentHeight', this.get('layoutService.contentHeight'));
    this.get('layoutService').on('content-height-update', this, this.updateContentHeight);
  },

  /**
   * Triggered whenever the app's content height changes. This usually happens
   * when the window is resized. Once we detect a change we:
   * 1. Update this component's `contentHeight` property and consequently its `height` style.
   * 2. Check the previous height. If previous height was zero that means the inspector launched
   * in the background and was therefore not visible. Go to (a). Otherwise skip (a).
   *   a. Rerender the component. This is needed because smoke and mirrors doesn't know that the content height
   *   has changed.
   *
   * @method updateContentHeight
   * @param  {Number} height The app's new content height
   */
  updateContentHeight(height) {
    let previousHeight = this.get('contentHeight');
    this.set('contentHeight', height);
    if (previousHeight === 0 && height > 0) {
      this.rerender();
    }

  },

  /**
   * Set up event listening on the individual rows in the table.
   * Rows can listen to these events by listening to events on the `rowEvents`
   * property.
   *
   * @method setupEvents
   */
  setupEvents() {
    this.set('rowEvents', EmberObject.extend(Evented).create());
    this.$().on('click mouseleave mouseenter', 'tr', run.bind(this, 'triggerRowEvent'));
  },

  /**
   * Hook called before destruction. Clean up events listeners.
   *
   * @method willDestroyElement
   */
  willDestroyElement() {
    this.get('layoutService').off('content-height-update', this, this.updateContentHeight);
    return this._super(...arguments);
  },

  /**
   * Broadcasts that an event was triggered on a row.
   *
   * @method triggerRowEvent
   * @param {Object}
   *  - {String} type The event type to trigger
   *  - {DOMElement} currentTarget The element the event was triggered on
   */
  triggerRowEvent({ type, currentTarget }) {
    this.get('rowEvents').trigger(type, { index: $(currentTarget).index(), type });
  },

  attributeBindings: ['style'],

  style: computed('height', function() {
    return htmlSafe(`height:${this.get('height')}px`);
  }),


  /**
   * Array of objects representing the columns to render
   * and their corresponding widths. This array is passed
   * through the template.
   *
   * Each item in the array has `width` and `id` properties.
   *
   * @property columns
   * @type {Array}
   */
  columns: computed(() => []),

  /**
   * Number passed from `x-list`. Indicates the header height
   * in pixels.
   *
   * @property headerHeight
   * @type {Number}
   */
  headerHeight: null,

  /**
   * @property height
   * @type {Integer}
   */
  height: computed('contentHeight', 'headerHeight', function() {
    let headerHeight = this.get('headerHeight');
    let contentHeight = this.get('contentHeight');

    // In testing list-view is created before `contentHeight` is set
    // which will trigger an exception
    if (!contentHeight) {
      return 1;
    }
    return contentHeight - headerHeight;
  })
});
