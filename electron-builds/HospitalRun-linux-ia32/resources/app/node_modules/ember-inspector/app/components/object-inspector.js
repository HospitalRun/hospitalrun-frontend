import Ember from "ember";
const { Component, computed } = Ember;
const get = Ember.get;
export default Component.extend({
  tagName: '',

  /**
   * Application Controller passed
   * through the template
   *
   * @property application
   * @type {Controller}
   */
  application: null,

  trail: computed('model.[]', function() {
    let nested = this.get('model').slice(1);
    if (nested.length === 0) { return ""; }
    return `.${nested.mapBy('property').join(".")}`;
  }),

  isNested: computed('model.[]', function() {
    return this.get('model.length') > 1;
  }),

  actions: {
    popStack() {
      if (this.get('isNested')) {
        this.get('application').popMixinDetails();
      }
    },

    sendObjectToConsole(obj) {
      let objectId = get(obj, 'objectId');
      this.get('port').send('objectInspector:sendToConsole', {
        objectId
      });
    },

    toggleInspector() {
      this.sendAction('toggleInspector', ...arguments);
    }
  }
});
