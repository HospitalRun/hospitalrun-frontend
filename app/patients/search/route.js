export default Ember.Route.extend({
    actions: {
        allPatients: function() {
            this.transitionTo('patients');
        }
    },
    
    searchText: null,
    model: function(params) {
        this.set('searchText', params.search_text);
        var queryParams = {
            containsValue: {
                value: params.search_text,
                keys: [
                '_id',
                'firstName',
                'lastName'
            ]},                            
        };
        return this.store.find('patient', queryParams);
    },    
    
    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('searchText', this.get('searchText'));
    }    
    
});
