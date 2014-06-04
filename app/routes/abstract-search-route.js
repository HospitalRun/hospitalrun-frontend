export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    searchKeys: null,    
    searchModel: null,
    searchText: null,    
    model: function(params) {
        this.set('searchText', params.search_text);
        var queryParams = {
            containsValue: {
                value: params.search_text,
                keys: this.searchKeys                            
            }
        };
        return this.store.find(this.searchModel, queryParams);
    },
    
    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('searchText', this.get('searchText'));
    }    
    
});
