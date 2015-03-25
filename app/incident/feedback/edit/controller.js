import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";

export default AbstractEditController.extend({
    needs: 'incident/edit',
    
    cancelAction: 'closeModal',
    
    editController: Ember.computed.alias('controllers.incident/edit'),    
    
    newFeedback: false,
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Feedback';
        }
        return 'Edit Feedback';
    }.property('isNew'),
    
    updateCapability: 'add_feedback',
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newFeedback', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(feedback) {
        if (this.get('newFeedback')) {            
            this.get('editController').send('addFeedback',feedback);
        } else {
            this.send('closeModal');
        }
    }
});
