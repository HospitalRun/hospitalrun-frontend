export default Ember.Route.extend({
    queryParams: {        
        searchText: {
            refreshModel: true
        }
    },
    
    actions: {
        queryParamsDidChange: function() {
            // opt into full refresh
            this.refresh();
        }
    },
    
    model: function(params) {
        var queryParams = {
            keys: [
                '_id',
                'description',
                'name',    
                'crossreference'
            ],                
            containsValue: params.queryParams.searchText
        };
        return this.store.find('inventory', queryParams);
    }
    
});
