import Ember from "ember";
export default Ember.ObjectController.extend({
    needs: ['visits','procedures/edit'],
    
    equipmentList: Ember.computed.alias('controllers.visits.equipmentList'),
    procedureController: Ember.computed.alias('controllers.procedures/edit'),        
    title: 'Add Equipment',
    updateButtonAction: 'update',    
    updateButtonText: 'Add',
    
    actions: {        
        cancel: function() {
            this.send('closeModal');
        },
        
        update: function() {
            var equipmentToAdd = this.get('equipmentToAdd');
            this.get('procedureController').send('addEquipment', equipmentToAdd);
        }        
    },
});