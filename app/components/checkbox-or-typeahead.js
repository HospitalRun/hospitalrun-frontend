import Ember from 'ember';
import SelectOrTypeahead from 'hospitalrun/components/select-or-typeahead';
export default SelectOrTypeahead.extend({
  checkboxesPerRow: 5,
  model: null,

  _getLabelFromContent: function(object) {
    var optionLabelPath = this.get('optionLabelPath');
    return this._getPropertyFromContent(optionLabelPath, object);
  },

  _getPropertyFromContent: function(property, object) {
    var retrieveObject = {
      content: object
    };
    return Ember.get(retrieveObject, property);
  },

  _getValueFromContent: function(object) {
    var optionValuePath = this.get('optionValuePath');
    return this._getPropertyFromContent(optionValuePath, object);
  },

  _mapCheckboxValues: function(value) {
    return {
      label: this._getLabelFromContent(value),
      value: this._getValueFromContent(value)
    };
  },

  _setup: function() {
    var property = this.get('property');
    Ember.defineProperty(this, 'errors', Ember.computed('model.errors.' + property, function() {
      var property = this.get('property'),
        errors = this.get('model.errors.' + property);
      if (!Ember.isEmpty(errors)) {
        return errors[0];
      }
    }));
  }.on('init'),

  checkboxRows: function() {
    var checkboxRows = [],
      checkboxesPerRow = this.get('checkboxesPerRow'),
      content = this.get('content'),
      allValues = content.copy();
    while (allValues.length > 0) {
      var checkBoxRowValues = allValues.splice(0, checkboxesPerRow).map(this._mapCheckboxValues.bind(this));
      checkboxRows.push(checkBoxRowValues);
    }
    return checkboxRows;
  }.property('content', 'checkboxesPerRow'),

  actions: {
    checkboxChanged: function(value, checked) {
      var property = this.get('property'),
        propertyName = 'model.' + property,
        selectedValues = this.get(propertyName);
      if (!Ember.isArray(selectedValues)) {
        selectedValues = [];
      }
      if (checked && !selectedValues.contains(value)) {
        selectedValues.addObject(value);
      } else if (!checked && selectedValues.contains(value)) {
        selectedValues.removeObject(value);
      }
      this.set(propertyName, selectedValues);
      this.set('selection', selectedValues);
      this.get('model').validate();
    }
  }

});
