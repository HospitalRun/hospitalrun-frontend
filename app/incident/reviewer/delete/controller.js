import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from "ember";
export default AbstractDeleteController.extend({
    needs: 'incident/edit',
    
    afterDeleteAction: 'notifyReviewerDelete',
    editController: Ember.computed.alias('controllers.incident/edit'),
    title: 'Delete Reviewer',
    
    actions: {
        notifyReviewerDelete: function() {
            this.send('closeModal');
            this.get('editController').send('deleteReviewer', this.get('model'));
        }
    }
});