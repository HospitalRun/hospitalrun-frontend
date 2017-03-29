import Ember from "ember";
const { Component, computed } = Ember;
const { notEmpty } = computed;

export default Component.extend({
  isExpanded: true,

  tagName: '',

  hasMap: notEmpty('model.hasSourceMap'),

  actions: {
    toggleExpand() {
      this.toggleProperty('isExpanded');
    }
  }
});
