import Ember from "ember";
export default Ember.TextField.extend({
  attributeBindings: ['label:data-label'],

  /**
   * The property-component instance.
   * Passed through the template.
   *
   * @property propertyComponent
   * @type {Ember.Component}
   */
  properyComponent: null,

  didInsertElement() {
    this.$().select();
    return this._super(...arguments);
  },

  insertNewline() {
    this.get('propertyComponent').send(this.get('save-property'));
    this.get('propertyComponent').send(this.get('finished-editing'));
  },

  cancel() {
    this.get('propertyComponent').send(this.get('finished-editing'));
  },

  focusOut() {
    this.get('propertyComponent').send(this.get('finished-editing'));
  }
});
