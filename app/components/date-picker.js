// Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
import InputComponent from 'ember-rapid-forms/components/em-input';
export default InputComponent.extend({
  htmlComponent: 'date-input',
  minDate: null,
  maxDate: null,
  originalPropery: null,
  showTime: false,
  yearRange: 10,

  didReceiveAttrs(attrs) {
    let dateProperty = this.get('property');
    let displayPropertyName = `display_${dateProperty}`;
    this.set('property', displayPropertyName);
    this.set('originalPropery', dateProperty);
    this._super(attrs);
  }
});
