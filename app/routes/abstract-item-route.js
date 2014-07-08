export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    additionalModels: null,
    allowSearch: true,
    currentScreenTitle: null,
    modelName: null,
    moduleName: null,
    newButtonAction: 'newItem',
    newButtonText: null,
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
            this.transitionTo(this.get('moduleName')+'.index');
        },        
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        },
        deleteItem: function(item) {            
            var deletePath = this.get('deletePath');
            this.send('openModal', deletePath, item);
        },        
        editItem: function(item) {
            this.transitionTo(this.get('editPath'), item);
        },        
        newItem: function() {
            var newId = this.generateId();
            var data = this.getNewData();
            if (newId) {
                data.id = newId;
            }
            var item = this.get('store').createRecord(this.get('modelName'), data);            
            this.transitionTo(this.get('editPath'), item);
        },        
        /**
         * Render a modal using the specifed path and optionally set a model.
         * @param modalPath the path to use for the controller and template.
         * @param model (optional) the model to set on the controller for the modal.
         */
        openModal: function(modalPath, model) {
            if (model) {
                this.controllerFor(modalPath).set('model', model);
            }
            this.renderModal(modalPath);
        },        
        
        /**
         * Action to set the current page title.
         * @param title the title to display.
         */
        setPageTitle: function(title) {
            this.setPageTitle(title);
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

    /**
     * Override this function to define what data a new model should be instantiated with.
     * Defaults to empty object
     */    
    getNewData: function() {
        return {};
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
        var propsToSet = this.getProperties('currentScreenTitle','newButtonAction','newButtonText','sectionTitle');        
        currentController.setProperties(propsToSet);
        if (!Ember.isEmpty(this.additionalModels)) {
            this.additionalModels.forEach(function(item) {
                controller.set(item.name, this.get(item.name));
            }.bind(this));
        }        
        this._super(controller, model);
    }
    
});