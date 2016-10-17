import Ember from 'ember';
import SelectOrTypeahead from 'hospitalrun/components/select-or-typeahead';
export default SelectOrTypeahead.extend({
  checkboxesPerRow: 5,
  model: null,

  _getLabelFromContent: function(object) {
    let optionLabelPath = this.get('optionLabelPath');
    return Ember.get(object, optionLabelPath);
  },

  _getValueFromContent: function(object) {
    let optionValuePath = this.get('optionValuePath');
    return Ember.get(object, optionValuePath);
  },

  _mapCheckboxValues: function(value) {
    return {
      label: this._getLabelFromContent(value),
      value: this._getValueFromContent(value)
    };
  },

  _setup: function() {
    let property = this.get('property');
    Ember.defineProperty(this, 'errors', Ember.computed(`model.errors.${property}`, function() {
      let property = this.get('property');
      let errors = this.get(`model.errors.${property}`);
      if (!Ember.isEmpty(errors)) {
        return errors[0];
      }
    }));
  }.on('init'),

  checkboxRows: function() {
    let checkboxRows = [];
    let checkboxesPerRow = this.get('checkboxesPerRow');
    let content = this.get('content');
    let allValues = content.copy();
    while (allValues.length > 0) {
      let checkBoxRowValues = allValues.splice(0, checkboxesPerRow).map(this._mapCheckboxValues.bind(this));
      checkboxRows.push(checkBoxRowValues);
    }
    return checkboxRows;
  }.property('content', 'checkboxesPerRow'),

  actions: {
    checkboxChanged: function(value, checked) {
      let property = this.get('property');
      let propertyName = `model.${property}`;
      let selectedValues = this.get(propertyName);
      if (!Ember.isArray(selectedValues)) {
        selectedValues = [];
      }
      if (checked && !selectedValues.includes(value)) {
        selectedValues.addObject(value);
      } else if (!checked && selectedValues.includes(value)) {
        selectedValues.removeObject(value);
      }
      this.set(propertyName, selectedValues);
      this.set('selection', selectedValues);
      this.get('model').validate().catch(Ember.K);
    }
  }

});
