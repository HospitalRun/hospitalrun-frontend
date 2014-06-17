export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    additionalModels: null,
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
        if (!Ember.isEmpty(this.additionalModels)) {
            return new Ember.RSVP.Promise(function(resolve, reject){
                var promises = this.additionalModels.map(function(modelMap) {
                    return this.store.find.apply(this.store, modelMap.findArgs);
                }.bind(this));                
                promises.push(this.store.find(this.get('modelName')));
                Ember.RSVP.allSettled(promises,'All Settled additional Models for'+this.get('modelName')).then(function(array){
                    array.forEach(function(item, index) {
                        if (index < this.additionalModels.length) {
                            if (item.state === 'fulfilled') {
                                this.set(this.additionalModels[index].name, item.value);
                            }
                        } else {
                            if (item.state === 'fulfilled') {
                                Ember.run(null, resolve, item.value);
                            } else {
                                Ember.run(null, reject, item.reason);
                            }
                        }
                    }.bind(this));
                }.bind(this));
            }.bind(this),'Additional Models for'+this.get('modelName'));
        } else {
             return this.store.find(this.get('modelName'));
        }        
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
        if (!Ember.isEmpty(this.additionalModels)) {
            this.additionalModels.forEach(function(item) {
                controller.set(item.name, this.get(item.name));
            }.bind(this));
        }        
        this._super(controller, model);
    }
    
});