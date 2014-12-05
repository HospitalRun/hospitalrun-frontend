export default Ember.Controller.extend({
    hideCancelButton: true,
    showUpdateButton: true,
    updateButtonAction: 'query',
    updateButtonText: 'Query',
    
    objectTypes: [
        'appointment',
        'imaging',
        'inv-location',
        'inv-purchase',
        'inv-request',
        'inventory',
        'invoice',
        'lab',
        'medication',
        'patient',
        'photo',
        'procedure',
        'visit',
        'vital'
    ],
    
    actions: {
        query: function() {
            var fieldName = this.get('fieldName'),
                objectType = this.get('objectType'),
                queryValue = this.get('queryValue');
            var query = {
                containsValue: {
                    value: queryValue,
                    keys: [fieldName]
                }
            };
            this.store.find(objectType, query).then(function(results) {
                if (Ember.isEmpty(results)) {
                    this.set('errorMessage', 'Query returned no results.');
                    this.set('haveError', true);
                    this.set('showQueryResults', false);
                } else {
                    var currentValue,
                        headers = ['id'],
                        resultRow,
                        resultRows = [];
                    results.get('firstObject').eachAttribute(function(name) {
                        headers.push(name);
                    });
                    
                    results.forEach(function(result) {
                        resultRow = [];
                        resultRow.push(result.get('id'));
                        headers.forEach(function(column) {
                            currentValue = result.get(column);
                            if (Ember.isEmpty(currentValue)) {
                                currentValue = '';
                            }
                            resultRow.push(currentValue);
                        });
                        resultRows.push(resultRow);
                    });
                    this.set('headers', headers);
                    this.set('resultRows', resultRows);
                    this.set('haveError', false);
                    this.set('showQueryResults', true);
                }
            }.bind(this), function(error) {
                this.set('errorMessage', error);
                this.set('haveError', true);
                this.set('showQueryResults', false);
            }.bind(this));
        }
    }
});