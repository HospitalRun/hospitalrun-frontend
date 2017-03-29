import Ember from "ember";
import RowEventsMixin from 'ember-inspector/mixins/row-events';
const { computed, Component, String: { htmlSafe } } = Ember;
const { not, bool, equal } = computed;

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

  /**
   * Has a view (component) instance.
   *
   * @property hasView
   * @type {Boolean}
   */
  hasView: bool('model.value.viewClass'),

  /**
   * Whether it has a tag or not.
   *
   * @property isTagless
   * @type {Boolean}
   */
  isTagless: equal('model.value.tagName', ''),

  /**
   * Whether it has an element or not (depends on the tagName).
   *
   * @property hasElement
   * @type {Boolean}
   */
  hasElement: not('isTagless'),

  /**
   * Whether it has a layout/template or not.
   *
   * @property hasTemplate
   * @type {Boolean}
   */
  hasTemplate: bool('model.value.template'),

  hasModel: bool('model.value.model'),

  hasController: bool('model.value.controller'),

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

  modelInspectable: computed('hasModel', 'model.value.model.type', function() {
    return this.get('hasModel') && this.get('model.value.model.type') === 'type-ember-object';
  }),

  labelStyle: computed('model.parentCount', function() {
    return htmlSafe(`padding-left: ${+this.get('model.parentCount') * 20 + 5}px;`);
  }),

  actions: {
    inspectView() {
      if (this.get('hasView')) {
        this.sendAction('inspect', this.get('model.value.objectId'));
      }
    },
    inspectElement(objectId) {
      let elementId;
      if (!objectId && this.get('hasElement')) {
        objectId = this.get('model.value.objectId');
      }
      if (!objectId) {
        elementId = this.get('model.value.elementId');
      }
      if (objectId || elementId) {
        this.sendAction('inspectElement', { objectId, elementId });
      }
    },
    inspectModel(objectId) {
      if (this.get('modelInspectable')) {
        this.sendAction('inspect', objectId);
      }
    }
  }
});
