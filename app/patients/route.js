export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    actions: {                
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        },
        newPatient: function() {
            var patient = this.get('store').createRecord('patient');
            this.controllerFor('patients.edit').set('model', patient);
            this.renderEditModal();
        },
        editPatient: function(item) {
            this.controllerFor('patients.edit').set('model',item);
            this.renderEditModal();     
        }        
    },
    
    model: function() {
        return this.store.find('patient');
    },
    
    renderEditModal: function() {
        this.render('patients.edit', {
            into: 'application',
            outlet: 'modal'
        });            
    },
    
    setupController: function(controller, model) { 
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute','/patients/search');
        this._super(controller, model);
    }
});