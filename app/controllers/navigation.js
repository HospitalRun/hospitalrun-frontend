export default Ember.Controller.extend({
    allowSearch: false,
    searchRoute: null,    
    actions: {
        search: function() {
            if (this.allowSearch && this.searchRoute) {
                this.transitionToRoute(this.searchRoute,  {
                    queryParams: {
                        searchText: this.get('searchText')
                    }
                });
            }
        }
    }
});