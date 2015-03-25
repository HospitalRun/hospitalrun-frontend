import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from "ember";
export default AbstractDeleteController.extend({
    needs: 'incident/edit',
    
    afterDeleteAction: 'notifyInvestigationFindingDelete',
    editController: Ember.computed.alias('controllers.incident/edit'),
    title: 'Delete Investigation Finding',
    
    actions: {
        notifyInvestigationFindingDelete: function() {
            this.send('closeModal');
            this.get('editController').send('deleteInvestigationFinding', this.get('model'));
        }
    }
});