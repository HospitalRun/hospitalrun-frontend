<<<<<<< HEAD
// Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
import InputComponent from 'ember-rapid-forms/components/em-input';
export default InputComponent.extend({
  dateSetAction: null, // Specify an action to fire when a date is selected
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
=======
import { isEmpty } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  actions: {
    dateSetActionWrapper(newDate) {
      if (!isEmpty(this.get('dateSetAction'))) {
        this.sendAction('dateSetAction', newDate);
      }
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
