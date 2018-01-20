import Ember from 'ember';
import EmInput from 'ember-rapid-forms/components/em-input';
import PikadayComponent from 'hospitalrun/mixins/pikaday-component';

export default EmInput.extend(PikadayComponent, {
  _shouldSetDate(currentDate, picker) {
    return (picker && (Ember.isEmpty(currentDate)
      || Ember.isEmpty(picker.getDate())
      || (currentDate.getTime && picker.getDate().getTime() !== currentDate.getTime())));
  },

  currentDateChangedValue() {
    let currentDate = this.get('currentDate');
    let picker = this.get('_picker');
    if (!Ember.isEmpty(currentDate) && this._shouldSetDate(currentDate, picker)) {
      picker.setDate(currentDate);
    }
  },

  format: function() {
    let showTime = this.get('showTime');
    if (showTime) {
      return 'l h:mm A';
    } else {
      return 'l';
    }
  }.property('showTime'),

  showTimeChanged: function() {
    let picker = this.get('_picker');
    if (picker) {
      picker.destroy();
      this.didInsertElement();
    }
  }.observes('showTime'),

  dateSet() {
    let currentDate = this.get('currentDate');
    let picker = this.get('_picker');
    if (this._shouldSetDate(currentDate, picker)) {
      let newDate = picker.getDate();
      let dateSetAction = this.get('dateSetAction');
      this.set('currentDate', newDate);
      if (!Ember.isEmpty(dateSetAction)) {
        this.sendAction('dateSetAction', newDate);
      }
    }
  },

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    let dateProperty = this.get('originalPropery');
    let displayPropertyName = `display_${dateProperty}`;
    this.currentDate = Ember.computed.alias(`model.${dateProperty}`);
    this.addObserver(`model.${dateProperty}`, this, this.currentDateChangedValue);
    Ember.Binding.from(`model.errors.${dateProperty}`).to(`model.errors.${displayPropertyName}`).connect(this);
  }
});
