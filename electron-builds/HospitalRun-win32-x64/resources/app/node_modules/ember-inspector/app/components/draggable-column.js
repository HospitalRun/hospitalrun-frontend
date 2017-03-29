// DraggableColumn
// ===============
// A wrapper for a resizable-column and a drag-handle component

import Ember from "ember";
const { Component, inject } = Ember;
const { service } = inject;

export default Component.extend({
  tagName: '', // Prevent wrapping in a div
  side: 'left',
  minWidth: 60,
  setIsDragging: 'setIsDragging',

  /**
   * Injected `layout` service. Used to broadcast
   * changes the layout of the app.
   *
   * @property layout
   * @type {Service}
   */
  layout: service(),

  /**
   * Trigger that the application dimensions have changed due to
   * something being dragged/resized such as the main nav or the
   * object inspector.
   *
   * @method triggerResize
   */
  triggerResize() {
    this.get('layout').trigger('resize', { source: 'draggable-column' });
  },

  actions: {
    setIsDragging(isDragging) {
      this.sendAction('setIsDragging', isDragging);
    },

    /**
     * Action called whenever the draggable column has been
     * resized.
     *
     * @method didDrag
     */
    didDrag() {
      this.triggerResize();
    }
  }
});
