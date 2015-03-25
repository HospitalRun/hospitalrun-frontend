import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from "ember";
export default AbstractDeleteController.extend({
    needs: 'incident/edit',
    
    afterDeleteAction: 'notifyFeedbackDelete',
    editController: Ember.computed.alias('controllers.incident/edit'),
    title: 'Delete Feedback',
    
    actions: {
        notifyFeedbackDelete: function() {
            this.send('closeModal');
            this.get('editController').send('deleteFeedback', this.get('model'));
        }
    }
});