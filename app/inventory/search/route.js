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
            containsValue: {
                value: params.queryParams.searchText,
                keys: [
                '_id',
                'description',
                'name',    
                'crossreference'
            ]},                            
        };
        return this.store.find('inventory', queryParams);
    }
    
});
