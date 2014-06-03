import GenderList from 'hospitalrun/mixins/gender-list';  
export default Ember.ObjectController.extend(GenderList, Ember.SimpleAuth.AuthenticatedRouteMixin, {        
    needs: ['patients'],
    
    
    actions: {        
        deletePatient: function() {
            var patient = this.get('model'); 
            patient.deleteRecord();      
            patient.save();    
        }
    }
});