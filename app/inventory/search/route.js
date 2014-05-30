export default Ember.Route.extend({    
    searchText: null,
    model: function(params) {
        this.set('searchText', params.search_text);
        var queryParams = {
            containsValue: {
                value: params.search_text,
                keys: [
                '_id',
                'description',
                'name',    
                'crossreference'
            ]},                            
        };
        return this.store.find('inventory', queryParams);
    },
    
    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('searchText', this.get('searchText'));
    }
    
});
