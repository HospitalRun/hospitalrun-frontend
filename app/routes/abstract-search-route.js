import Ember from "ember";
export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    searchKeys: null,    
    searchModel: null,
    searchText: null,    
    model: function(params) {
        this.set('searchText', params.search_text);
        var queryParams = this.getQueryParams(params.search_text);
        return this.store.find(this.searchModel, queryParams);
    },
    
    /**
     * Get the query params to run against the store find function.
     * By default this function will return a query that does a "contains"
     * search against all of the searchKeys defined for this route.
     * You can override this function if you need additional/different parameters.
     * @param searchText string containing text to search for.
     */
    getQueryParams: function(searchText) {
        return {
            containsValue: {
                value: searchText,
                keys: this.searchKeys                            
            }
        };        
    },
    
    setupController: function(controller, model) {
        controller.set('hasRecords', (model.get('length') > 0));
        controller.set('model', model);
        controller.set('searchText', this.get('searchText'));
        var parentController = this.controllerFor(this.get('moduleName'));
        var searchTitle = 'Search Results for <i>'+this.get('searchText')+'</i>';
        parentController.set('currentScreenTitle', searchTitle.htmlSafe());
    }    
    
});
