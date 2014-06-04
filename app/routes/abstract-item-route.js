export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    modelName: null,
    moduleName: null,
    
    editPath: function() {
        var module = this.get('moduleName');
        return module + '.edit';
    }.property('moduleName'),
    
    searchRoute: function() {
        var module = this.get('moduleName');
        return '/'+module + '/search';
    }.property('moduleName'),

    
    actions: {                
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        },
        newItem: function() {
            var item = this.get('store').createRecord(this.get('modelName'));
            this.controllerFor(this.get('editPath')).set('model', item);
            this.renderEditModal();
        },
        deleteItem: function(item) {            
            item.deleteRecord();      
            item.save();    
        },        
        editItem: function(item) {
            this.controllerFor(this.get('editPath')).set('model',item);
            this.renderEditModal();     
        }
    },
    
    model: function() {
        return this.store.find(this.get('modelName'));
    },
    
    renderEditModal: function() {
        this.render(this.get('editPath'), {
            into: 'application',
            outlet: 'modal'
        });            
    },
    
    setupController: function(controller, model) { 
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute',this.get('searchRoute'));
        this._super(controller, model);
    }
});