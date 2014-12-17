import Ember from "ember";
export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    editTitle: null,
    hideNewButton: false,
    modelName: null,
    newTitle: null,
    
    idParam: function() {
        var modelName = this.get('modelName');
        return modelName + '_id';
    }.property('modelName'),
    
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
    
    model: function(params) {
        var idParam = this.get('idParam');
        if (!Ember.isEmpty(idParam) && params[idParam] === 'new') {
            var newId = this.generateId();
            var data = this.getNewData();
                if (newId) {
                    data.id = newId;
                }
            return this.get('store').createRecord(this.get('modelName'), data);            
        } else {
            return this._super(params);
        }
    },
    
    setupController: function(controller, model) {
        var sectionDetails = {};
        if (model.get('isNew')) {
            sectionDetails.currentScreenTitle = this.get('newTitle');
        } else {
            sectionDetails.currentScreenTitle = this.get('editTitle');
        }        
        if (this.get('hideNewButton')) {
            sectionDetails.newButtonAction = null;
        }
        this.send('setSectionHeader', sectionDetails);
        this._super(controller, model);
    }
});