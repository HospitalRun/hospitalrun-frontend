import Ember from 'ember';
import DS from 'ember-data';
import InputComponent from 'ember-rapid-forms/components/em-input';
export default InputComponent.extend({
  _mapContentItems: function() {
    let content = this.get('content');
    if (content) {
      let mapped = content.filter(function(item) {
        return !Ember.isEmpty(item);
      });
      if (content instanceof DS.RecordArray) {
        mapped = mapped.map(function(item) {
          let returnObj = item.getProperties(this.get('displayKey'));
          returnObj[this.get('selectionKey')] = item;
          return returnObj;
        }.bind(this));
      } else {
        mapped = mapped.map(function(item) {
          let returnObj = {};
          returnObj[this.get('displayKey')] = item;
          return returnObj;
        }.bind(this));
      }
      return mapped;
    } else {
      return [];
    }
  },

  mappedContent: function() {
    return this._mapContentItems();
  }.property('content'),

  contentChanged: function() {
    let bloodhound = this.get('bloodhound');
    if (bloodhound) {
      bloodhound.clear();
      bloodhound.add(this._mapContentItems());
    }
  }.observes('content.[]'),

  bloodhound: null,
  displayKey: 'value',
  selectionKey: 'value',
  hint: true,
  highlight: true,
  lastHint: null,
  limit: 500,
  minlength: 1,
  selectedItem: false,
  inputElement: null,
  typeAhead: null,
  setOnBlur: true,
  templates: null,

  _getSource: function() {
    let typeAheadBloodhound = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace(this.get('displayKey')),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: this.get('mappedContent')
    });
    typeAheadBloodhound.initialize();
    this.set('bloodhound', typeAheadBloodhound);
    return typeAheadBloodhound.ttAdapter();
  },

  didInsertElement: function() {
    let $input = this.$('input');
    this.set('inputElement', $input);
    let $typeahead = $input.typeahead({
      autoselect: true,
      hint: this.get('hint'),
      highlight: this.get('highlight'),
      minLength: this.get('minlength')
    }, {
      displayKey: this.get('displayKey'),
      limit: this.get('limit'),
      source: this._getSource(),
      templates: this.get('templates')
    });
    this.set('typeAhead', $typeahead);

    $typeahead.on('typeahead:selected', function(event, item) {
      this.set('selection', item[this.get('selectionKey')]);
      this.set('selectedItem', true);
    }.bind(this));

    $typeahead.on('typeahead:autocompleted', function(event, item) {
      this.set('selection', item[this.get('selectionKey')]);
      this.set('selectedItem', true);
    }.bind(this));

    if (this.get('setOnBlur')) {
      $input.on('keyup', function() {
        let $hint = this.$('.tt-hint');
        let hintValue = $hint.val();
        this.set('lastHint', hintValue);
        this.set('selectedItem', false);
      }.bind(this));

      $input.on('blur', function(event) {
        let selection = this.get('selection');
        let targetValue = event.target.value.trim();
        if (!Ember.isEmpty(selection)) {
          if (selection.trim) {
            selection = selection.trim();
          }
          this.set('selection', selection);
        }
        if (!this.get('selectedItem')) {
          let lastHint = this.get('lastHint');
          let exactMatch = false;
          if (Ember.isEmpty(lastHint)) {
            lastHint = targetValue;
            exactMatch = true;
          }
          if (!Ember.isEmpty(targetValue) && !Ember.isEmpty(lastHint)) {
            this.get('bloodhound').search(lastHint, function(suggestions) {
              if (suggestions.length > 0) {
                if (!exactMatch || lastHint.toLowerCase() === suggestions[0][this.get('displayKey')].toLowerCase()) {
                  this.set('selectedItem', true);
                  this.set('selection', suggestions[0][this.get('selectionKey')]);
                  event.target.value = suggestions[0][this.get('displayKey')];
                  this.get('model').set(this.get('propertyName'), event.target.value);
                }
              } else if (targetValue !== selection) {
                this.set('selection');
              }
            }.bind(this));
          } else if (Ember.isEmpty(targetValue)) {
            this.set('selection');
          }
        }
      }.bind(this));

    }
  },

  willDestroyElement: function() {
    this.get('inputElement').typeahead('destroy');
  }

});
