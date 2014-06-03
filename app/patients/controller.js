export default Ember.ArrayController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    modelName: 'patient',    
    searchKeys: [
        '_id',
        'firstName',
        'lastName'
    ],    
    searchText: null,
    
    actions: {
        search: function(searchText) {
            this.set('searchText', searchText);
            var queryParams = {
                containsValue: {
                    value: searchText,
                    keys: this.searchKeys
                },                            
            };
            this.store.find(this.modelName, queryParams).then(function(results) {
                this.set('model', results);
                this.get('content').reload();
            }.bind(this));            
        }
    }
});
