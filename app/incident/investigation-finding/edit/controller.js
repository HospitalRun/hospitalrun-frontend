import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";

export default AbstractEditController.extend({
    needs: 'incident/edit',
    
    cancelAction: 'closeModal',
    
    editController: Ember.computed.alias('controllers.incident/edit'),

    typeOfPersonInvolved: [
        'Patient',
        'Staff',
        'Visitor'
    ],

    identityDocumentTypes: [
        'Employee Number',
        'ID Card',
        'Passport',
        'Medical Record Number',
        'Driving License Number',
        'Mobile Number'
    ],   
    
    newInvestigationFinding: false,
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Investigation Finding';
        }
        return 'Edit Investigation Finding';
    }.property('isNew'),
    
    updateCapability: 'add_investigation_finding',
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newInvestigationFinding', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(investigationFinding) {
        if (this.get('newInvestigationFinding')) {            
            this.get('editController').send('addInvestigationFinding',investigationFinding);
        } else {
            this.send('closeModal');
        }
    }
});
