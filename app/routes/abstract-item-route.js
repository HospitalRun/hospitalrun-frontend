export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    allowSearch: true,
    currentScreenTitle: null,
    editTitle: null,    
    modelName: null,
    moduleName: null,
    newButtonText: null,
    newTitle: null,
    sectionTitle:null, 
    
    editPath: function() {
        var module = this.get('moduleName');
        return module + '.edit';
    }.property('moduleName'),
    
    deletePath: function() {
        var module = this.get('moduleName');
        return module + '.delete';        
    }.property('moduleName'),
    
    searchRoute: function() {
        var module = this.get('moduleName');
        return '/'+module + '/search';
    }.property('moduleName'),

    
    actions: {
        allItems: function() {
            this.setPageTitle(this.get('currentScreenTitle'));
            this.transitionTo(this.get('moduleName')+'.index');
        },        
        
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        },
        newItem: function() {
            var newId = this.generateId();
            var data = {};
            if (newId) {
                data.id = newId;
            }
            var item = this.get('store').createRecord(this.get('modelName'), data);            
            this.transitionTo(this.get('editPath'), item);
            this.setPageTitle(this.get('newTitle'));
            
        },
        deleteItem: function(item) {
            var deletePath = this.get('deletePath');
            this.controllerFor(deletePath).set('model', item);
            this.renderModal(deletePath);
        },        
        editItem: function(item) {
            this.transitionTo(this.get('editPath'), item);
            this.setPageTitle(this.get('editTitle'));
        }
    },
    
    /**
     * Override this function to generate an id for a new record
     * @return a generated id;default is null which means that an
     * id will be automatically generated via Ember data.
     */
    generateId: function() {
        return null;                
    },
    
    model: function() {
        return this.store.find(this.get('modelName'));
    },
    
    renderModal: function(template) {
        this.render(template, {
            into: 'application',
            outlet: 'modal'
        });            
    },
    
    renderTemplate: function() {
        this.render('section');
    },
    
    setPageTitle: function(title) {
        var currentController = this.controllerFor(this.get('moduleName'));
        currentController.set('currentScreenTitle', title);        
    },
    
    setupController: function(controller, model) { 
        var navigationController = this.controllerFor('navigation');
        if (this.get('allowSearch') === true) {
            navigationController.set('allowSearch',true);
            navigationController.set('searchRoute',this.get('searchRoute'));
        }
        var currentController = this.controllerFor(this.get('moduleName'));
        var propsToSet = this.getProperties('currentScreenTitle','newButtonText','sectionTitle');        
        currentController.setProperties(propsToSet);        
        this._super(controller, model);
    }
});