export default Ember.Controller.extend({
    allowSearch: false,
    searchRoute: null,    
    actions: {
        search: function() {
            if (this.allowSearch && this.searchRoute) {
                var textToFind = this.get('searchText');
                this.set('searchText','');
                this.transitionToRoute(this.searchRoute+"/"+textToFind);
            }
        }
    }
});