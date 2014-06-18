
export default Em.Forms.FormInputComponent.extend({
    mappedContent: function() {
        var content = this.get('content');
        if (content) {
            var mapped = content.filter(function(item) {
                return !Ember.isEmpty(item);
            });
            mapped = mapped.map(function(item) {
                var returnObj = {};
                returnObj[this.get('displayKey')] = item;
                return returnObj;
            }.bind(this));
            return mapped;
        } else {
            return [];
        }        
    }.property('content'),
    
    displayKey: 'value',
    selectionKey: 'value',
    hint: true, 
    highlight: true,
    minlength: 1,
    selectedItem: false,
    inputElement: null,
    typeAhead: null,

    _getSource: function() {
        var typeAheadBloodhound = new Bloodhound( {
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(this.get('displayKey')),
            queryTokenizer: Bloodhound.tokenizers.whitespace,            
            local: this.get('mappedContent')
        });
        typeAheadBloodhound.initialize();
        return typeAheadBloodhound.ttAdapter();
    },
    
    didInsertElement: function() {
        var $input = this.$('input');
        this.set('inputElement', $input);
        var $typeahead = $input.typeahead({
            autoselect: true,
            hint: this.get('hint'),
            highlight: this.get('highlight'),
            minLength: this.get('minlength'),
        }, {            
            displayKey: this.get('displayKey'),
            source: this._getSource()
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
    },

    willDestroyElement: function() {
        this.get('inputElement').typeahead('destroy');
    }

});
