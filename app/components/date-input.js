import Ember from 'ember';
import HtmlInput from 'ember-rapid-forms/components/html-input';
export default HtmlInput.extend({
  minDate: null,
  maxDate: null,
  format: 'l',
  showTime: false,
  yearRange: 10,

  _picker: null,

  _shouldSetDate: function(currentDate, picker) {
    return (picker && (Ember.isEmpty(currentDate) ||
    Ember.isEmpty(picker.getDate()) ||
    (currentDate.getTime && picker.getDate().getTime() !== currentDate.getTime())));
  },

  currentDateChangedValue: function() {
    var currentDate = this.get('currentDate'),
      picker = this.get('_picker');
    if (this._shouldSetDate(currentDate, picker)) {
      picker.setDate(currentDate);
    }
  }.observes('currentDate'),

  showTimeChanged: function() {
    var picker = this.get('_picker');
    if (picker) {
      picker.destroy();
      this.didInsertElement();
    }
  }.observes('showTime'),

  dateSet: function() {
    var currentDate = this.get('currentDate'),
      picker = this.get('_picker');
    if (this._shouldSetDate(currentDate, picker)) {
      this.set('currentDate', picker.getDate());
    }
  },

  didInsertElement: function() {
    var currentDate = this.get('currentDate'),
      $input = this.$('input'),
      picker = null,
      props = this.getProperties('format', 'yearRange', 'showTime');

    props.onSelect = this.dateSet.bind(this);

    if (!Ember.isEmpty(this.get('minDate'))) {
      props.minDate = this.get('minDate');
      if (props.minDate === 'now') {
        props.minDate = new Date();
      }
    }
    if (!Ember.isEmpty(this.get('maxDate'))) {
      props.maxDate = this.get('maxDate');
      if (props.maxDate === 'now') {
        props.maxDate = new Date();
      }
    }
    props.field = $input[0];
    picker = new Pikaday(props);
    picker.setDate(currentDate);
    this.set('_picker', picker);
  },

  didReceiveAttrs(/*attrs*/) {
    this._super(...arguments);
    var dateProperty = this.get('mainComponent.property'),
      displayPropertyName = 'display_' + dateProperty;
    this.set('mainComponent.property', displayPropertyName);
    this.currentDate = Ember.computed.alias('mainComponent.model.' + dateProperty);
    this.selectedValue = Ember.computed.alias('mainComponent.model.' + displayPropertyName);
    Ember.Binding.from('mainComponent.model.errors.' + dateProperty).to('mainComponent.model.errors.' + displayPropertyName).connect(this);
  },

  willDestroyElement: function() {
    var picker = this.get('_picker');
    if (picker) {
      picker.destroy();
    }
    this.set('_picker', null);
  }

});
