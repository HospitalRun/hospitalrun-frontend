import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend({
  class: 'scrollable-typeahead',
  minlength: 2,
  selectionKey: 'id',
  setOnBlur: true,
  templates: {
    header: '<div class="alert alert-success well-sm query-results" role="alert"></div>'
  },

  _sourceQuery: function(query, cb) { // Custom source function
    // Get the data from the Blodhound engine and process it.
    this.bloodhound.get(query, function(suggestions) {
      cb(suggestions);
      // Set the headers content.
      let $header = this.$('.query-results');
      $header.html(`<strong><em>${query}</em></strong> returned <strong>${suggestions.length}</strong> results`);
    }.bind(this));
  },

  _getSource: function() {
    return this._sourceQuery.bind(this);
  }
});
