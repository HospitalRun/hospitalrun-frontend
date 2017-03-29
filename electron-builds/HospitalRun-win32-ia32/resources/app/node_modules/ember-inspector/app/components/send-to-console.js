import Ember from "ember";
export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['send-to-console', 'js-send-to-console-btn'],
  action: 'sendValueToConsole',
  click() {
    this.sendAction('action', this.get('param'));
  }
});
