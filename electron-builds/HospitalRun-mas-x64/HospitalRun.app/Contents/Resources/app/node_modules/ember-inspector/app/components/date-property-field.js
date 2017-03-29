import Ember from "ember";
import DatePicker from "ember-inspector/components/pikaday-input";
const { on, run: { once } } = Ember;
const KEY_EVENTS = {
  escape: 27
};

export default DatePicker.extend({
  /**
   * Workaround bug of `onPikadayClose` being called
   * on a destroyed component.
   */
  onPikadayClose() {
    if (!this.$()) { return; }
    return this._super(...arguments);
  },

  openDatePicker: on('didInsertElement', function() {
    once(this.$(), 'click');
  }),

  keyUp(e) {
    if (e.keyCode === KEY_EVENTS.escape) {
      this.sendAction('cancel');
    }
    return this._super(...arguments);
  }
});
