import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";

export default AbstractEditController.extend({
    cancelAction: 'closeModal',

    editController: Ember.inject.controller('incident/edit'),    
    
    newFeedback: false,
    
    title: function() {
        var isNew = this.get('model.isNew');
        if (isNew) {
            return 'Add Feedback';
        }
        return 'Edit Feedback';
    }.property('model.isNew'),
    
    updateCapability: 'add_feedback',
    
    beforeUpdate: function() {
        if (this.get('model.isNew')) {
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
