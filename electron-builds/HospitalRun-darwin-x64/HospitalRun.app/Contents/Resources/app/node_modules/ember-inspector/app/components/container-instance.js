/**
 * This component is used to wrap every row in the container
 * instances template.
 *
 * The main purpose for this component is to use the `RowEvents`
 * mixin so we can send `on-click` events when a row is clicked.
 *
 * Since it has no tag it has no effect on the DOM hierarchy.
 */
import Ember from 'ember';
import RowEventsMixin from 'ember-inspector/mixins/row-events';
const { Component } = Ember;
export default Component.extend(RowEventsMixin, {
  /**
   * No tag
   *
   * @property tagName
   * @type {String}
   */
  tagName: ''
});
