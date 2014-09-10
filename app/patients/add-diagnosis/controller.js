import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
export default Ember.ObjectController.extend(IsUpdateDisabled, {
    diagnosisChanged: function() {
        this.get('model').validate();
    }.observes('diagnosisId'),
    
    needs: 'visits/edit',
    
    editController: Ember.computed.alias('controllers.visits/edit'),    
    title: 'Add Diagnosis',
    updateButtonText: 'Add',
    updateButtonAction: 'add',
    showUpdateButton: true,
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        add: function() {
            var newDiag = {
                id: this.get('diagnosisId'),
                date: new Date(),
                description: this.get('diagnosis')                
            };
            this.get('editController').send('addDiagnosis',newDiag);            
        }
    }
});
