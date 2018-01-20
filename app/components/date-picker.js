import DateInput from 'hospitalrun/components/date-input';

// Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
export default DateInput.extend({
  dateSetAction: null, // Specify an action to fire when a date is selected
  minDate: null,
  maxDate: null,
  originalPropery: null,
  showTime: false,
  yearRange: 10
});
