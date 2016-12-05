import InputComponent from 'ember-rapid-forms/components/em-input';
export default InputComponent.extend({
  sanitizeFunction(value) {
    return value.replace(new RegExp(/([^0-9|.]+)/g), '');
  },

  focusOut() {
    this._sanitizeValue();
    return this._super();
  },

  keyUp() {
    this._sanitizeValue();
    return this._super();
  },

  _sanitizeValue() {
    let model = this.get('model');
    let property = this.get('property');
    let currentValue = model.get(property);
    let clean = this.get('sanitizeFunction')(currentValue);
    model.set(property, clean);
  }
});
