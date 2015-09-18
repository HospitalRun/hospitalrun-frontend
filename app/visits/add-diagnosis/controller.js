import Ember from 'ember';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({  
    diagnosisList: Ember.computed.alias('controllers.visits.diagnosisList'),
    
    needs: ['visits','visits/edit'],
    
    editController: Ember.computed.alias('controllers.visits/edit'), 
    lookupListsToUpdate: [{
        name: 'diagnosisList',
        property: 'diagnosis',
        id: 'diagnosis_list'
    }],
    title: 'Add Diagnosis',
    updateButtonText: 'Add',
    updateButtonAction: 'add',
    showUpdateButton: true,
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        add: function() {
            this.updateLookupLists();
            var newDiag = {                
                date: new Date(),
                description: this.get('diagnosis')                
            };
            this.get('editController').send('addDiagnosis',newDiag);            
        }
    }
});
