import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: ['visits','visits/edit'],
        
    cancelAction: 'returnToVisit',
    
    physicianList: Ember.computed.alias('controllers.visits.physicianList'),
    lookupListsToUpdate: [{
        name: 'physicianList',
        property: 'assistant',
        id: 'physician_list'
    },{
        name: 'physicianList',
        property: 'physician',
        id: 'physician_list'
    }],
    
    editController: Ember.computed.alias('controllers.visits/edit'),
    visitProcedures: Ember.computed.alias('visit.procedures'),
    
    newProcedure: false,
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Procedure';
        }
        return 'Edit Procedure';
	}.property('isNew'),
    
    billingIdChanged: function() {
        this.get('model').validate();
    }.observes('billingId'),
    
    updateCapability: 'add_procedure',
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newProcedure', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(procedure) {
        if (this.get('newProcedure')) {
            this.get('visitProcedures').then(function(list) {
                list.addObject(procedure);
                this.get('editController').send('update');
                this.send('returnToVisit');
            }.bind(this));            
        } else {
            this.send('returnToVisit');
        }
    }
});
