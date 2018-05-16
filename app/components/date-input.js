<<<<<<< HEAD
import Ember from 'ember';
import HtmlInput from 'ember-rapid-forms/components/html-input';
import PikadayComponent from 'hospitalrun/mixins/pikaday-component';
export default HtmlInput.extend(PikadayComponent, {
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
  }.property('mainComponent.showTime'),

  showTimeChanged: function() {
    let picker = this.get('_picker');
    if (picker) {
      picker.destroy();
      this.didInsertElement();
    }
  }.observes('mainComponent.showTime'),

  dateSet() {
    let currentDate = this.get('currentDate');
    let picker = this.get('_picker');
    if (this._shouldSetDate(currentDate, picker)) {
      let newDate = picker.getDate();
      let mainComponent = this.get('mainComponent');
      let dateSetAction = mainComponent.get('dateSetAction');
      this.set('currentDate', newDate);
      if (!Ember.isEmpty(dateSetAction)) {
        mainComponent.sendAction('dateSetAction', newDate);
      }
    }
  },

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    let dateProperty = this.get('mainComponent.originalPropery');
    let displayPropertyName = `display_${dateProperty}`;
    this.currentDate = Ember.computed.alias(`mainComponent.model.${dateProperty}`);
    this.minDate = Ember.computed.alias('mainComponent.minDate');
    this.maxDate = Ember.computed.alias('mainComponent.maxDate');
    this.showTime = Ember.computed.alias('mainComponent.showTime');
    this.yearRange = Ember.computed.alias('mainComponent.yearRange');
    this.addObserver(`mainComponent.model.${dateProperty}`, this, this.currentDateChangedValue);
    Ember.Binding.from(`mainComponent.model.errors.${dateProperty}`).to(`mainComponent.model.errors.${displayPropertyName}`).connect(this);
  }

});
=======
import { defineProperty } from '@ember/object';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import EmInput from 'ember-rapid-forms/components/em-input';
import PikadayComponent from 'hospitalrun/mixins/pikaday-component';

export default EmInput.extend(PikadayComponent, {
  _shouldSetDate(currentDate, picker) {
    return picker && (isEmpty(currentDate)
      || isEmpty(picker.getDate())
      || (currentDate.getTime && picker.getDate().getTime() !== currentDate.getTime()));
  },

  currentDateChangedValue() {
    let currentDate = this.get('currentDate');
    let picker = this.get('_picker');
    if (!isEmpty(currentDate) && this._shouldSetDate(currentDate, picker)) {
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
      if (!isEmpty(dateSetAction)) {
        this.sendAction('dateSetAction', newDate);
      }
    }
  },

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    let dateProperty = this.get('originalProperty');
    let displayPropertyName = `display_${dateProperty}`;
    this.currentDate = alias(`model.${dateProperty}`);
    this.addObserver(`model.${dateProperty}`, this, this.currentDateChangedValue);
    defineProperty(this, `model.errors.${displayPropertyName}`, alias(`model.errors.${dateProperty}`));
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
