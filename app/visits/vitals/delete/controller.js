import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from "ember";
export default AbstractDeleteController.extend({
    needs: 'visits/edit',
    
    afterDeleteAction: 'notifyVitalsDelete',
    editController: Ember.computed.alias('controllers.visits/edit'),
    title: 'Delete Vitals',
    
    actions: {
        notifyVitalsDelete: function() {
            this.send('closeModal');
            this.get('editController').send('deleteVitals', this.get('model'));
        }
    }
});