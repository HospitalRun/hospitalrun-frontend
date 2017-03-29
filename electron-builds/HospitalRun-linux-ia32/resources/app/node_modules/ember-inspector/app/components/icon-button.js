import Ember from "ember";
const { Component } = Ember;
export default Component.extend({
  attributeBindings: ['title'],

  tagName: 'button',

  title: null,

  click() {
    this.sendAction();
  }
});
